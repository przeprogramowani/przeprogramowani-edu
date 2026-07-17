import type { APIContext, APIRoute } from 'astro';
import { findCourseAsset } from '@/server/content/courseAssets';

export const GET: APIRoute = ({ params }: APIContext) => {
  const courseId = params.courseId;
  const slug = params.slug;

  if (!courseId || !slug) {
    return new Response('Bad Request', { status: 400 });
  }

  const asset = findCourseAsset(courseId, slug);
  if (!asset) {
    return new Response('Not Found', { status: 404 });
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: asset.assetUrl,
      'Cache-Control': 'private, no-store',
    },
  });
};
