import type { APIRoute } from 'astro';
import { processQuery } from '../../services/claudeAgentService';

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
    const answer = await processQuery(query);

    return new Response(JSON.stringify(answer), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
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
