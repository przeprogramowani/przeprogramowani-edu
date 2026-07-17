import { getCustomerPurchases } from '@/server/airtable/airtable-api';
import { upsertGrant } from './accessService';
import { ADMIN_EMAILS } from '@/server/admins';

type SyncEnv = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  AIRTABLE_API_KEY: string;
};

// Expand AirtableCourse enum values to CourseSlug values in DB
const AIRTABLE_TO_SLUGS: Record<string, string[]> = {
  OPANUJ_FRONTEND:   ['opanuj-frontend', 'opanuj-frontend-live'],
  CURSOR_AI:         ['cursor-ai'],
  OPANUJ_TYPESCRIPT: ['opanuj-typescript-core', 'opanuj-typescript-react'],
  '10XDEVS_1':       ['10xdevs-1'],
  '10XDEVS_2':       ['10xdevs-2'],
  '10XDEVS_2_EN':    ['10xdevs-2-en'],
  '10XDEVS_3':       ['10xdevs-3', '10xdevs-3-prework'],
};

// All courses for admin emails
const ADMIN_COURSES = Object.values(AIRTABLE_TO_SLUGS).flat();

export async function syncFromAirtable(
  userId: string,
  email: string,
  env: SyncEnv
): Promise<void> {
  console.info('[airtableSyncService] starting sync', { email });
  try {
    let slugsToGrant: string[];

    if (ADMIN_EMAILS.includes(email)) {
      slugsToGrant = ADMIN_COURSES;
      console.info('[airtableSyncService] admin user — granting all courses', {
        email,
        slugs: slugsToGrant,
      });
    } else {
      const { purchasedCourses } = await getCustomerPurchases(email, env.AIRTABLE_API_KEY);
      slugsToGrant = purchasedCourses.flatMap((c) => AIRTABLE_TO_SLUGS[c] ?? []);
      console.info('[airtableSyncService] airtable lookup complete', {
        email,
        airtableCourses: purchasedCourses,
        slugsToGrant,
      });
    }

    await Promise.all(
      slugsToGrant.map((slug) =>
        upsertGrant(userId, slug, 'airtable', env, { syncedFromAirtable: true })
      )
    );

    console.info('[airtableSyncService] sync complete', { email, count: slugsToGrant.length });
  } catch (error) {
    // Log but do not throw — sync failure should not block login
    console.error('[airtableSyncService] sync failed:', error);
  }
}
