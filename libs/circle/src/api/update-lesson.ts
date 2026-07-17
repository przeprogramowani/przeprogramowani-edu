const API_URL = 'https://app.circle.so';

const headers = (token: string) => ({
  Authorization: `Token ${token}`,
  'Content-Type': 'application/json',
});

/**
 * Updates lesson content in Circle via the admin API
 * Uses native fetch for compatibility with both Node.js and Cloudflare Workers
 */
export async function updateLessonContent(
  token: string,
  sectionId: number,
  lessonId: number,
  bodyHtml: string
): Promise<void> {
  const url = `${API_URL}/api/admin/v2/course_lessons/${lessonId}`;

  const response = await fetch(url, {
    method: 'PATCH',
    headers: headers(token),
    body: JSON.stringify({
      body_html: bodyHtml,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update lesson ${lessonId} in section ${sectionId}: ${response.status} ${response.statusText}`
    );
  }
}
