import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ cookies, redirect }) => {
  // Remove the JWT token cookie
  cookies.delete('token', {
    path: '/',
  });

  // Redirect to home page
  return redirect('/', 302);
};
