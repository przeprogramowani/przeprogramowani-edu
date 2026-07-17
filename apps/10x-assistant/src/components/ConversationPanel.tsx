import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import type { ChatMessage } from '../store/chatThread';
import { useStreamingQuery } from '../hooks/useStreamingQuery';

const NOW = () => Date.now();
const buildMessageId = () => crypto.randomUUID();

interface ConversationPanelProps {
  endpoint: string;
  title: string;
}

export interface ConversationPanelRef {
  submitQuery: (prompt: string) => Promise<void>;
}

export const ConversationPanel = forwardRef<ConversationPanelRef, ConversationPanelProps>(
  ({ endpoint, title }, ref) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const endRef = useRef<HTMLDivElement | null>(null);
    const currentMessageIdRef = useRef<string | null>(null);

    // Use streaming hook
    const { state: streamState, executeQuery, reset: resetStream } = useStreamingQuery(endpoint);

    const addMessage = useCallback((message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    }, []);

    const updateLastMessage = useCallback((updates: Partial<ChatMessage>) => {
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastIndex = newMessages.length - 1;
        if (lastIndex >= 0) {
          newMessages[lastIndex] = { ...newMessages[lastIndex], ...updates };
        }
        return newMessages;
      });
    }, []);

    const clear = useCallback(() => {
      setMessages([]);
      resetStream();
    }, [resetStream]);

    const handleSubmit = useCallback(
      async (prompt: string) => {
        const trimmedPrompt = prompt.trim();
        if (!trimmedPrompt || streamState.isStreaming) {
          return;
        }

        // Add user message
        addMessage({
          id: buildMessageId(),
          role: 'user',
          content: trimmedPrompt,
          timestamp: NOW(),
        });

        // Create a placeholder assistant message
        const assistantId = buildMessageId();
        currentMessageIdRef.current = assistantId;
        addMessage({
          id: assistantId,
          role: 'assistant',
          content: '',
          timestamp: NOW(),
        });

        // Start streaming
        await executeQuery(trimmedPrompt);
      },
      [addMessage, streamState.isStreaming, executeQuery]
    );

    // Expose submitQuery method to parent via ref
    useImperativeHandle(
      ref,
      () => ({
        submitQuery: handleSubmit,
      }),
      [handleSubmit]
    );

    // Update the assistant message as streaming progresses
    useEffect(() => {
      if (streamState.isStreaming || streamState.currentAnswer || streamState.sources.length > 0) {
        const sources = streamState.sources.length > 0 ? streamState.sources.map((s) => s.title) : undefined;

        updateLastMessage({
          content: streamState.currentAnswer || 'Przeszukuję źródła...',
          sources,
        });
      }

      // Handle errors
      if (streamState.error) {
        updateLastMessage({
          content: `Error: ${streamState.error}`,
        });
      }
    }, [streamState, updateLastMessage]);

    useEffect(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamState.currentAnswer]);

    const isLoading = streamState.isStreaming;

    const messageList = useMemo(
      () =>
        messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === 'user'
                ? 'self-end rounded-lg bg-blue-600 px-4 py-3 text-sm text-white shadow'
                : 'self-start rounded-lg bg-slate-800 px-4 py-3 text-sm text-slate-100 shadow'
            }>
            <p className="whitespace-pre-wrap">{message.content}</p>
            {message.sources && message.sources.length > 0 && (
              <div className="mt-2 space-y-1 text-xs">
                <p className="font-medium text-slate-300">Źródła</p>
                <ul className="list-disc space-y-1 pl-4 text-slate-400">
                  {message.sources.map((source) => (
                    <li key={source}>{source}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )),
      [messages]
    );

    return (
      <div className="flex h-full flex-col">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-slate-800 px-4 py-3">
          <div>
            <h2 className="text-base font-semibold text-white">{title}</h2>
            <p className="text-xs text-slate-500">{endpoint}</p>
          </div>
          <button
            type="button"
            onClick={clear}
            className="rounded-md border border-slate-700 px-2 py-1 text-xs font-medium text-slate-300 transition hover:border-slate-500 hover:text-white">
            Wyczyść
          </button>
        </header>

        {/* Messages area - scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-4">
            <div className="flex flex-col gap-3">
              {messageList.length > 0 ? (
                messageList
              ) : (
                <p className="text-sm text-slate-400">Zacznij rozmowę zadając pytanie o materiały 10xDevs.</p>
              )}
              {isLoading && (
                <div className="self-start rounded-lg bg-slate-800 px-4 py-3 text-sm text-slate-300 shadow">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>
                        {streamState.sources.length === 0 && 'Szukam odpowiednich źródeł…'}
                        {streamState.sources.length > 0 && !streamState.currentAnswer && 'Generuję odpowiedź…'}
                        {streamState.currentAnswer && 'Strumieniuję odpowiedź…'}
                      </span>
                    </div>
                    {streamState.sources.length > 0 && (
                      <div className="text-xs text-slate-400">
                        Znaleziono {streamState.sources.length}{' '}
                        {streamState.sources.length === 1
                          ? 'odpowiednie źródło'
                          : streamState.sources.length < 5
                          ? 'odpowiednie źródła'
                          : 'odpowiednich źródeł'}
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ConversationPanel.displayName = 'ConversationPanel';
