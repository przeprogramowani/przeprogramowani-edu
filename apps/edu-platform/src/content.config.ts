import { defineCollection, z } from 'astro:content';
import { fileURLToPath } from 'url';

import { htmlLessonLoader } from './server/content/htmlLessonLoader';

const lessonSchema = z.object({
  id: z.string(),
  name: z.string(),
  content: z.string(),
  lessonId: z.string().optional(),
  language: z.enum(['pl', 'en']).optional(),
  order: z.number().optional(),
  slug: z.string().optional(),
  source: z.enum(['markdown', 'html']).optional(),
});

function contentPattern(pattern: string): string {
  return fileURLToPath(new URL(`./content/${pattern}`, import.meta.url));
}

const lessonsOfe = defineCollection({
  loader: async () => await htmlLessonLoader(contentPattern('lessonsOfe/*.html')),
  schema: lessonSchema,
});

const livesOfe = defineCollection({
  loader: () => htmlLessonLoader(contentPattern('livesOfe/*.html')),
  schema: lessonSchema,
});

const lessonsOtsReact = defineCollection({
  loader: () => htmlLessonLoader(contentPattern('lessonsOtsReact/*.html')),
  schema: lessonSchema,
});

const lessonsOtsCore = defineCollection({
  loader: () => htmlLessonLoader(contentPattern('lessonsOtsCore/*.html')),
  schema: lessonSchema,
});

const lessonsCursor = defineCollection({
  loader: () => htmlLessonLoader(contentPattern('lessonsCursor/*.html')),
  schema: lessonSchema,
});

const lessons10xDevs1 = defineCollection({
  loader: () => htmlLessonLoader(contentPattern('lessons10xDevs1/*.html')),
  schema: lessonSchema,
});

const lessons10xDevs2 = defineCollection({
  loader: () => htmlLessonLoader(contentPattern('lessons10xDevs2/*.html')),
  schema: lessonSchema,
});

const lessons10xDevs2EN = defineCollection({
  loader: () => htmlLessonLoader(contentPattern('lessons10xDevs2EN/*.html')),
  schema: lessonSchema,
});

const lessons10xDevs3 = defineCollection({
  loader: () => htmlLessonLoader(contentPattern('lessons10xDevs3/pl/*.html')),
  schema: lessonSchema,
});

const lessons10xDevs3En = defineCollection({
  loader: () => htmlLessonLoader(contentPattern('lessons10xDevs3/en/*.html')),
  schema: lessonSchema,
});

const lessons10xDevs3Prework = defineCollection({
  loader: () => htmlLessonLoader(contentPattern('lessons10xDevs3Prework/pl/*.html')),
  schema: lessonSchema,
});

const lessons10xDevs3PreworkEn = defineCollection({
  loader: () => htmlLessonLoader(contentPattern('lessons10xDevs3Prework/en/*.html')),
  schema: lessonSchema,
});

const checklists = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    module: z.string(),
    description: z.string(),
    order: z.number().optional(),
  }),
});

export const collections = {
  lessonsOtsReact,
  lessonsOtsCore,
  lessonsOfe,
  livesOfe,
  lessonsCursor,
  lessons10xDevs1,
  lessons10xDevs2,
  lessons10xDevs2EN,
  lessons10xDevs3,
  lessons10xDevs3En,
  lessons10xDevs3Prework,
  lessons10xDevs3PreworkEn,
  checklists,
};
