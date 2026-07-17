import Airtable from 'airtable';
import { type AirtableCourse, getAirtableCourseFromIds } from './airtable-course';
import { ADMIN_EMAILS } from '@/server/admins';

const BASE_ID = 'appBN64leXIbQ1gDe';
const TABLE_NAME = 'Klienci';

const COLUMNS = {
  EMAIL: 'Email',
  LOGIN: 'Login email',
  PURCHASED_COURSES: 'Posiadane produkty',
};

let base: Airtable.Base | null = null;

export interface CustomerPurchase {
  email: string;
  purchasedCourses: AirtableCourse[];
}

export async function getCustomerPurchases(customerEmail: string, apiKey: string): Promise<CustomerPurchase> {
  if (ADMIN_EMAILS.includes(customerEmail)) {
    return {
      email: customerEmail,
      purchasedCourses: ['OPANUJ_FRONTEND', 'CURSOR_AI', 'OPANUJ_TYPESCRIPT'],
    };
  }

  try {
    base =
      base ??
      new Airtable({
        apiKey,
      }).base(BASE_ID as string);

    const records = await base(TABLE_NAME)
      .select({
        filterByFormula: `FIND('${customerEmail}', {${COLUMNS.LOGIN}})`,
      })
      .firstPage();

    if (records.length === 0) {
      return { email: customerEmail, purchasedCourses: [] };
    }

    // Get all unique course IDs across all matching records
    const allCourseIds = new Set<string>();
    records.forEach((record) => {
      const courseIds = (record.get(COLUMNS.PURCHASED_COURSES) as string[]) || [];
      courseIds.forEach((id) => allCourseIds.add(id));
    });

    const purchasedCourses: AirtableCourse[] = getAirtableCourseFromIds(Array.from(allCourseIds));

    // Use the email from the first record (they should all be for the same customer)
    return {
      email: records[0].get(COLUMNS.EMAIL) as string,
      purchasedCourses: purchasedCourses,
    };
  } catch (error) {
    console.error('Error fetching customer purchases:', error);
    throw error;
  }
}
