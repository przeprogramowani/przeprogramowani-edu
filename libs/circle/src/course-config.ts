import { Platform, type CourseConfig } from './types';

export const TEN_X_DEVS_FIRST_ED: CourseConfig = {
  platform: Platform.CIRCLE_BRAVE,
  directory_name: '10xdevs-1ed',
  space_id: 1905722,
  section_ids: [523702, 523703, 523705, 523706, 523707],
};

export const TEN_X_DEVS_SECOND_ED: CourseConfig = {
  platform: Platform.CIRCLE_BRAVE,
  directory_name: '10xdevs-2ed',
  space_id: 2166705,
  section_ids: [681279, 681379, 681280, 681281, 681282, 681283],
};

export const TEN_X_DEVS_THIRD_ED: CourseConfig = {
  platform: Platform.CIRCLE_BRAVE,
  directory_name: '10xdevs-3ed',
  space_id: 2552674,
  section_ids: [966234, 966235, 966236, 966240, 966241],
};

export const TEN_X_DEVS_THIRD_ED_EN: CourseConfig = {
  platform: Platform.CIRCLE_BRAVE,
  directory_name: '10xdevs-3ed-en',
  space_id: 2601706,
  section_ids: [998474, 998475],
};

export const OPANUJ_FRONTEND: CourseConfig = {
  platform: Platform.CIRCLE_PRZEPROGRAMOWANI,
  directory_name: 'opanuj-frontend',
  space_id: 944958,
  section_ids: [
    171690, 179634, 273910, 179636, 273909, 179637, 273908, 179638, 273906, 179639, 273905,
  ],
};

export const AVAILABLE_COURSES = [TEN_X_DEVS_FIRST_ED, TEN_X_DEVS_SECOND_ED, OPANUJ_FRONTEND];
