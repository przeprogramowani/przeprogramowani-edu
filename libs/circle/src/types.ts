export enum Platform {
  CIRCLE_BRAVE = 'circle-brave',
  CIRCLE_PRZEPROGRAMOWANI = 'circle-przeprogramowani',
}

export interface CourseConfig {
  platform: Platform;
  directory_name: string;
  space_id: number;
  section_ids: number[];
}

export interface Lesson {
  id: number;
  name: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
  section_id: number;
  is_comments_enabled: boolean;
  is_featured_media_enabled: boolean;
  is_featured_media_download_enabled: boolean;
  body_html: string;
}

export interface Course {
  page: number;
  per_page: number;
  has_next_page: boolean;
  count: number;
  page_count: number;
  records: Lesson[];
}
