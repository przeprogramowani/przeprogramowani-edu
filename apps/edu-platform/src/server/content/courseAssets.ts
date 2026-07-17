import { MAIN_COURSE_ID } from './mainCourseContent';
import { PREWORK_COURSE_ID } from './preworkContent';

import m0AssetUrl from '@/assets/ai-artifacts/10xdevs3-artifacts-m0.zip?url';
import m1AssetUrl from '@/assets/ai-artifacts/10xdevs3-artifacts-m1.zip?url';
import m2AssetUrl from '@/assets/ai-artifacts/10xdevs3-artifacts-m2.zip?url';
import m3AssetUrl from '@/assets/ai-artifacts/10xdevs3-artifacts-m3.zip?url';
import m4AssetUrl from '@/assets/ai-artifacts/10xdevs3-artifacts-m4.zip?url';
import m5AssetUrl from '@/assets/ai-artifacts/10xdevs3-artifacts-m5.zip?url';

export interface CourseAssetItem {
  slug: string;
  label: string;
  filename: string;
  assetUrl: string;
}

export interface CourseAssetGroup {
  moduleLabel: string;
  items: CourseAssetItem[];
}

const TEN_X_DEVS_3_ASSETS: CourseAssetGroup[] = [
  {
    moduleLabel: 'Moduł 0',
    items: [
      {
        slug: 'm0',
        label: 'Zasoby i skille dla Agenta z modułu 0',
        filename: '10xdevs3-artifacts-m0.zip',
        assetUrl: m0AssetUrl,
      },
    ],
  },
  {
    moduleLabel: 'Moduł 1',
    items: [
      {
        slug: 'm1',
        label: 'Zasoby i skille dla Agenta z modułu 1',
        filename: '10xdevs3-artifacts-m1.zip',
        assetUrl: m1AssetUrl,
      },
    ],
  },
  {
    moduleLabel: 'Moduł 2',
    items: [
      {
        slug: 'm2',
        label: 'Zasoby i skille dla Agenta z modułu 2',
        filename: '10xdevs3-artifacts-m2.zip',
        assetUrl: m2AssetUrl,
      },
    ],
  },
  {
    moduleLabel: 'Moduł 3',
    items: [
      {
        slug: 'm3',
        label: 'Zasoby i skille dla Agenta z modułu 3',
        filename: '10xdevs3-artifacts-m3.zip',
        assetUrl: m3AssetUrl,
      },
    ],
  },
  {
    moduleLabel: 'Moduł 4',
    items: [
      {
        slug: 'm4',
        label: 'Zasoby i skille dla Agenta z modułu 4',
        filename: '10xdevs3-artifacts-m4.zip',
        assetUrl: m4AssetUrl,
      },
    ],
  },
  {
    moduleLabel: 'Moduł 5',
    items: [
      {
        slug: 'm5',
        label: 'Zasoby i skille dla Agenta z modułu 5',
        filename: '10xdevs3-artifacts-m5.zip',
        assetUrl: m5AssetUrl,
      },
    ],
  },
];

const REGISTRY: Record<string, CourseAssetGroup[]> = {
  [MAIN_COURSE_ID]: TEN_X_DEVS_3_ASSETS,
  [PREWORK_COURSE_ID]: TEN_X_DEVS_3_ASSETS,
};

export function getCourseAssets(courseId: string): CourseAssetGroup[] {
  return REGISTRY[courseId] ?? [];
}

export function findCourseAsset(courseId: string, slug: string): CourseAssetItem | null {
  for (const group of getCourseAssets(courseId)) {
    const hit = group.items.find((item) => item.slug === slug);
    if (hit) return hit;
  }
  return null;
}
