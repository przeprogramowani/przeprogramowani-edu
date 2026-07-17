/**
 * Rejestr dedykowanych stron skilli Core Skills Chain (CSC).
 * Kazdy wpis mapuje slug URL (/10xdevs-3/workflow/skill/<slug>) na krok
 * lancucha (id sekcji na stronie CSC), kolor akcentu i uniwersum kroku.
 * Kolory akcentu = kanon uniwersow (universes.ts) - nie zmieniac osobno.
 */

import { UNIVERSES } from './universes';

export interface SkillPage {
  slug: string;
  skill: string;
  title: string;
  /** Tytul wersji angielskiej (misja EN); breadcrumb jest jezykowo neutralny. */
  titleEn: string;
  /** Breadcrumb w hudzie - czytany przez wrapper gated i publiczny. */
  breadcrumb: string;
  step: string;
  accent: string;
  universeId: string;
}

export const SKILL_PAGES: SkillPage[] = [
  {
    slug: '10x-new',
    skill: '/10x-new',
    title: 'Skill /10x-new - nowa jednostka pracy',
    titleEn: 'Skill /10x-new - a new unit of work',
    breadcrumb: '10X WORKFLOW // SKILL // /10X-NEW',
    step: 'k-new',
    accent: UNIVERSES.ender.color,
    universeId: 'ender',
  },
  {
    slug: '10x-research',
    skill: '/10x-research',
    title: 'Skill /10x-research - dowody z repozytorium',
    titleEn: 'Skill /10x-research - evidence from the repository',
    breadcrumb: '10X WORKFLOW // SKILL // /10X-RESEARCH',
    step: 'k-research',
    accent: UNIVERSES.trzycia.color,
    universeId: 'trzycia',
  },
  {
    slug: '10x-plan',
    skill: '/10x-plan',
    title: 'Skill /10x-plan - decyzje przed kodem',
    titleEn: 'Skill /10x-plan - decisions before code',
    breadcrumb: '10X WORKFLOW // SKILL // /10X-PLAN',
    step: 'k-plan',
    accent: UNIVERSES.hyperion.color,
    universeId: 'hyperion',
  },
  {
    slug: '10x-implement',
    skill: '/10x-implement',
    title: 'Skill /10x-implement - realizacja etap po etapie',
    titleEn: 'Skill /10x-implement - stage-by-stage delivery',
    breadcrumb: '10X WORKFLOW // SKILL // /10X-IMPLEMENT',
    step: 'k-implement',
    accent: UNIVERSES.expanse.color,
    universeId: 'expanse',
  },
  {
    slug: '10x-impl-review',
    skill: '/10x-impl-review',
    title: 'Skill /10x-impl-review - plan kontra kod',
    titleEn: 'Skill /10x-impl-review - plan versus code',
    breadcrumb: '10X WORKFLOW // SKILL // /10X-IMPL-REVIEW',
    step: 'k-review',
    accent: UNIVERSES.wh40k.color,
    universeId: 'wh40k',
  },
];
