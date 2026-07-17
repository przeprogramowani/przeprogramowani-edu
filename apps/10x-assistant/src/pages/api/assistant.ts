import type { APIRoute } from 'astro';
import type { Answer } from '../../types/answer';

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

  // TODO: Implement actual assistant logic
  const answer: Answer = {
    response: `You asked: ${query}`,
    sources: [],
  };

  return new Response(JSON.stringify(answer), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
