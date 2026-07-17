import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useCallback, useMemo, useRef, useState } from 'react';
import { ConversationPanel, type ConversationPanelRef } from './ConversationPanel';
import { UserQueryInput } from './UserQueryInput';

export default function ChatApp() {
  const queryClient = useMemo(() => new QueryClient(), []);
  const [input, setInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const ragPanelRef = useRef<ConversationPanelRef>(null);
  const agentPanelRef = useRef<ConversationPanelRef>(null);

  const handleSubmit = useCallback(async () => {
    const prompt = input.trim();
    if (!prompt || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setInput('');

    // Submit to both panels simultaneously
    try {
      await Promise.all([ragPanelRef.current?.submitQuery(prompt), agentPanelRef.current?.submitQuery(prompt)]);
    } finally {
      setIsSubmitting(false);
    }
  }, [input, isSubmitting]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen flex-col">
        {/* Conversation panels */}
        <div className="flex flex-1 divide-x divide-slate-800 overflow-hidden">
          <div className="w-1/2">
            <ConversationPanel ref={ragPanelRef} endpoint="/api/rag-stream" title="RAG Retrieval" />
          </div>
          <div className="w-1/2">
            <ConversationPanel ref={agentPanelRef} endpoint="/api/agent-stream" title="Claude Agent" />
          </div>
        </div>

        {/* Centralized input area */}
        <div className="shrink-0 border-t border-slate-800 bg-slate-950 px-4 py-3">
          <div className="max-w-4xl mx-auto">
            <UserQueryInput
              value={input}
              onChange={setInput}
              onSubmit={handleSubmit}
              disabled={isSubmitting}
              placeholder="Zadaj pytanie…"
            />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
