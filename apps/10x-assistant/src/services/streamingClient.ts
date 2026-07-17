/**
 * Client-side helper for consuming the streaming RAG API
 *
 * Usage example:
 *
 * ```tsx
 * const [lessons, setLessons] = useState([]);
 * const [sources, setSources] = useState([]);
 * const [answer, setAnswer] = useState('');
 * const [isStreaming, setIsStreaming] = useState(false);
 *
 * const handleQuery = async (query: string) => {
 *   setIsStreaming(true);
 *   setAnswer('');
 *   setLessons([]);
 *   setSources([]);
 *
 *   await consumeStreamingQuery(query, {
 *     onLessons: (data) => setLessons(data.lessons),
 *     onSources: (data) => setSources(data.sources),
 *     onAnswerChunk: (data) => setAnswer(prev => prev + data.chunk),
 *     onComplete: (data) => {
 *       console.log('Query complete', data);
 *       setIsStreaming(false);
 *     },
 *     onError: (data) => {
 *       console.error('Error:', data.message);
 *       setIsStreaming(false);
 *     },
 *   });
 * };
 * ```
 */

export interface StreamingCallbacks {
  onLessons?: (data: { lessons: Array<{ lessonId: string; similarity: number }> }) => void;
  onSources?: (data: { sources: Array<{ lessonId: string; title: string }> }) => void;
  onAnswerChunk?: (data: { chunk: string }) => void;
  onAnswerComplete?: (data: { answer: string }) => void;
  onComplete?: (data: { response: string; sources: string[] }) => void;
  onError?: (data: { message: string }) => void;
}

export async function consumeStreamingQuery(query: string, callbacks: StreamingCallbacks): Promise<void> {
  const response = await fetch('/api/rag-stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
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

  try {
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

        // Dispatch to appropriate callback
        switch (eventType) {
          case 'lessons':
            callbacks.onLessons?.(data);
            break;
          case 'sources':
            callbacks.onSources?.(data);
            break;
          case 'answer_chunk':
            callbacks.onAnswerChunk?.(data);
            break;
          case 'answer_complete':
            callbacks.onAnswerComplete?.(data);
            break;
          case 'complete':
            callbacks.onComplete?.(data);
            break;
          case 'error':
            callbacks.onError?.(data);
            break;
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
