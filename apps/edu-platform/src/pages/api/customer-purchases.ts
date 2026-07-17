import type { APIContext, APIRoute } from 'astro';
import { getCustomerPurchases } from '@/server/airtable/airtable-api';
import { AIRTABLE_API_KEY } from 'astro:env/server';

export const GET: APIRoute = async ({ url, locals }: APIContext) => {
  const email = url.searchParams.get('email');

  if (!email) {
    return new Response(JSON.stringify({ error: 'Email parameter is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const customerPurchases = await getCustomerPurchases(email, AIRTABLE_API_KEY);

    if (!customerPurchases) {
      return new Response(JSON.stringify({ error: 'Customer not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    return new Response(JSON.stringify(customerPurchases), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
};
