import type { APIRoute } from 'astro';
import { processQueryStream } from '../../services/claudeAgentService';

export const POST: APIRoute = async ({ request }) => {
  let body;

  try {
    body = await request.json();
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid JSON in request body' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const { query } = body;

  if (!query || typeof query !== 'string') {
    return new Response(JSON.stringify({ error: 'Query field is required and must be a string' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    // Create a ReadableStream for Server-Sent Events
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          // Iterate through the streaming query results
          for await (const event of processQueryStream(query)) {
            // Check if the client has disconnected
            try {
              controller.enqueue(encoder.encode(event));
            } catch (enqueueError) {
              // Client disconnected, stop processing
              console.log('[agent-stream] Client disconnected, stopping stream');
              break;
            }
          }

          // Close the stream when done
          controller.close();
        } catch (error) {
          console.error('[agent-stream] Streaming error:', error);
          try {
            const errorEvent = `event: error\ndata: ${JSON.stringify({
              message: error instanceof Error ? error.message : 'Unknown error occurred',
            })}\n\n`;
            controller.enqueue(encoder.encode(errorEvent));
          } catch {
            // Client already disconnected, ignore
          }
          controller.close();
        }
      },
      cancel(reason) {
        console.log('[agent-stream] Stream cancelled by client:', reason);
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to process query' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};

