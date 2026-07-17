import { type AirtableCourse } from '@/server/airtable/airtable-course';

export interface AuthResult {
  isAuthenticated: boolean;
  email?: string;
  userId?: string;
  purchases?: AirtableCourse[];
  firstName?: string | null;
  lastName?: string | null;
  avatarUrl?: string | null;
}
