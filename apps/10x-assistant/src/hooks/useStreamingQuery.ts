import { useState, useCallback, useRef, useEffect } from 'react';

export interface StreamingLesson {
  lessonId: string;
  similarity: number;
}

export interface StreamingSource {
  lessonId: string;
  title: string;
}

export interface StreamingState {
  isStreaming: boolean;
  currentAnswer: string;
  lessons: StreamingLesson[];
  sources: StreamingSource[];
  error: string | null;
}

export interface UseStreamingQueryResult {
  state: StreamingState;
  executeQuery: (query: string) => Promise<void>;
  reset: () => void;
  abort: () => void;
}

export function useStreamingQuery(endpoint: string): UseStreamingQueryResult {
  const [state, setState] = useState<StreamingState>({
    isStreaming: false,
    currentAnswer: '',
    lessons: [],
    sources: [],
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount - abort any ongoing requests
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        console.log('[useStreamingQuery] Cleaning up: aborting active request');
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      console.log('[useStreamingQuery] Manually aborting request');
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setState(prev => ({
        ...prev,
        isStreaming: false,
      }));
    }
  }, []);

  const reset = useCallback(() => {
    abort(); // Abort any ongoing request
    setState({
      isStreaming: false,
      currentAnswer: '',
      lessons: [],
      sources: [],
      error: null,
    });
  }, [abort]);

  const executeQuery = useCallback(
    async (query: string) => {
      // Abort any ongoing request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      // Reset state for new query
      setState({
        isStreaming: true,
        currentAnswer: '',
        lessons: [],
        sources: [],
        error: null,
      });

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (!response.body) {
          throw new Error('No response body');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            break;
          }

          // Decode the chunk and add to buffer
          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE messages
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || ''; // Keep incomplete message in buffer

          for (const line of lines) {
            if (!line.trim()) continue;

            // Parse SSE format: "event: eventType\ndata: {...}"
            const eventMatch = line.match(/^event:\s*(.+)$/m);
            const dataMatch = line.match(/^data:\s*(.+)$/m);

            if (!eventMatch || !dataMatch) continue;

            const eventType = eventMatch[1].trim();
            const data = JSON.parse(dataMatch[1]);

            // Handle different event types
            switch (eventType) {
              case 'lessons':
                setState((prev) => ({ ...prev, lessons: data.lessons }));
                break;

              case 'sources':
                setState((prev) => ({ ...prev, sources: data.sources }));
                break;

              case 'answer_chunk':
                setState((prev) => ({
                  ...prev,
                  currentAnswer: prev.currentAnswer + data.chunk,
                }));
                break;

              case 'answer_complete':
                setState((prev) => ({ ...prev, currentAnswer: data.answer }));
                break;

              case 'complete':
                setState((prev) => ({
                  ...prev,
                  isStreaming: false,
                  currentAnswer: data.response,
                }));
                break;

              case 'error':
                setState((prev) => ({
                  ...prev,
                  isStreaming: false,
                  error: data.message,
                }));
                break;
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          // Query was aborted, don't update error state
          return;
        }

        setState((prev) => ({
          ...prev,
          isStreaming: false,
          error: error instanceof Error ? error.message : 'Unknown error occurred',
        }));
      }
    },
    [endpoint]
  );

  return {
    state,
    executeQuery,
    reset,
    abort,
  };
}

