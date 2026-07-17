import { query as claudeQuery } from '@anthropic-ai/claude-agent-sdk';
import type { SDKMessage } from '@anthropic-ai/claude-agent-sdk';
import type { Answer } from '../types/answer';

/**
 * Process a query using Claude Agent SDK (non-streaming)
 */
export async function processQuery(queryText: string): Promise<Answer> {
  try {
    const messages: SDKMessage[] = [];
    let finalResult = '';
    const sources: string[] = [];

    // Create query with basic configuration
    const result = claudeQuery({
      prompt: `
        Twoim zadaniem jest odpowiedzieć na pytanie użytkownika na podstawie kontekstu.

        Dostarczony kontekst znajdziesz w folderze ./source

        Oto pytanie użytkownika:
        <query>
        ${queryText}
        </query>

        Odpowiedz poprawną polszczyzną, bez dodatkowego formatowania Markdown.
      `,
      options: {
        systemPrompt: {
          type: 'preset',
          preset: 'claude_code',
        },
        permissionMode: 'bypassPermissions', // Bypass permissions for now (no tools)
        allowedTools: [], // No tools enabled yet
      },
    });

    // Collect all messages
    for await (const message of result) {
      messages.push(message);

      // Extract assistant responses
      if (message.type === 'assistant') {
        const content = message.message.content;
        for (const block of content) {
          if (block.type === 'text') {
            finalResult += block.text;
          }
        }
      }

      // Handle final result message
      if (message.type === 'result') {
        if (message.subtype === 'success') {
          finalResult = message.result || finalResult;
        }
      }
    }

    return {
      response: finalResult || 'No response generated',
      sources,
    };
  } catch (error) {
    console.error('Error processing Claude Agent query:', error);
    throw new Error(`Failed to process query: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Format data as Server-Sent Events (SSE)
 */
function formatSSE(eventType: string, data: unknown): string {
  return `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
}

/**
 * Streaming version for Claude Agent using SDK
 */
export async function* processQueryStream(queryText: string): AsyncGenerator<string, void, unknown> {
  try {
    let fullResponse = '';
    const sources: string[] = ['Claude Agent'];

    // Yield initial sources event
    yield formatSSE('sources', {
      sources: [{ lessonId: 'agent', title: 'Claude Agent Analysis' }],
    });

    // Create query with basic configuration
    const result = claudeQuery({
      prompt: queryText,
      options: {
        systemPrompt: {
          type: 'preset',
          preset: 'claude_code',
        },
        permissionMode: 'bypassPermissions', // Bypass permissions for now
        allowedTools: [], // No tools enabled yet
        includePartialMessages: true, // Enable streaming events
      },
    });

    // Stream messages as they arrive
    for await (const message of result) {
      // Handle system initialization
      if (message.type === 'system' && message.subtype === 'init') {
        // System initialized, continue
        continue;
      }

      // Handle assistant messages
      if (message.type === 'assistant') {
        const content = message.message.content;
        for (const block of content) {
          if (block.type === 'text') {
            const text = block.text;
            fullResponse += text;

            // Stream the text chunk
            yield formatSSE('answer_chunk', {
              chunk: text,
            });
          }
        }
      }

      // Handle streaming events (partial messages)
      if (message.type === 'stream_event') {
        const event = message.event;

        // Handle content block delta (streaming text)
        if (event.type === 'content_block_delta') {
          if (event.delta.type === 'text_delta') {
            const text = event.delta.text;
            fullResponse += text;

            yield formatSSE('answer_chunk', {
              chunk: text,
            });
          }
        }
      }

      // Handle final result
      if (message.type === 'result') {
        if (message.subtype === 'success') {
          const finalText = message.result || fullResponse;

          yield formatSSE('answer_complete', {
            answer: finalText,
          });

          yield formatSSE('complete', {
            response: finalText,
            sources,
          });
        } else {
          // Handle errors
          yield formatSSE('error', {
            message: `Query ended with status: ${message.subtype}`,
          });
        }
      }
    }
  } catch (error) {
    console.error('Error processing Claude Agent query stream:', error);
    yield formatSSE('error', {
      message: error instanceof Error ? error.message : 'Failed to process query',
    });
  }
}
