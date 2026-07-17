# Bilingual 10xDevs 3 Prework Implementation Plan

## Overview

Implement Polish and English 10xDevs 3 prework as a separate protected external resource under `10xdevs-3-prework`, with local Markdown as the source of truth and `lessonId`-based URLs for now.

The canonical prework route shape is:

- `/external/10xdevs-3-prework/pl/{lessonId}`
- `/external/10xdevs-3-prework/en/{lessonId}`

The canonical prework login route is:

- `/external/10xdevs-3-prework/login`

The login screen, magic-link email, loading states, errors, and success messages should be localized from a sanitized return URL or an explicit safe language hint. The resource must remain separate from the main `10xdevs-3` course. Do not model prework as `/external/10xdevs-3/prework`, `/courses/10xdevs-3/<lang>/prework`, or nested `10xdevs-3/prework` paths.

The plan also expands the local content model so both `10xdevs-3-prework` and `10xdevs-3` can be built from Markdown, instead of assuming the HTML-file-only model used by 10xDevs 2.

## Current State Analysis

The platform already has a protected 10xDevs 3 permission model and a Markdown-based prework collection, but the current prework path is Polish-only and mostly follows the generic `/courses` course route assumptions.

Key discoveries:

- `CourseSlug` already includes `10xdevs-3` and `10xdevs-3-prework`; both map to `10XDEVS_3`.
- The current prework collection is Markdown-only: `lessons10xDevs3Prework`.
- The old Markdown loader derived lesson IDs from the first two filename characters, which made URLs like `/lesson/03` possible.
- External-course auth already exists for `/external/[courseId]/login`, `/api/external/auth`, and `/external/[courseId]/verify`.
- Existing external lesson routes are shaped around `/external/[courseId]/[lessonId]`; bilingual prework needs a language segment before `lessonId`.
- Existing shared GUID generation mostly assumes `.html` files, so Markdown-backed resources need separate handling if shared links are required later.

## Desired End State

After implementation:

1. Protected prework lesson routes exist for both languages:
   - `/external/10xdevs-3-prework/pl/{lessonId}`
   - `/external/10xdevs-3-prework/en/{lessonId}`
2. `10xdevs-3-prework` remains a separate first-class resource and does not become `10xdevs-3/prework`.
3. Prework access uses `/external/10xdevs-3-prework/login`, not `/courses` and not the general platform OAuth login.
4. The prework login flow is localized for Polish and English.
5. Lesson identity stays `lessonId` for now. Slug generation and slug URLs are explicitly deferred.
6. Polish prework Markdown can be served through the external bilingual route.
7. English prework has its own Markdown collection or directory scaffold, using matching `lessonId` values across languages.
8. Both `/10xdevs-3-prework` and `/10xdevs-3/` content pipelines can be backed by Markdown, not only static HTML files.
9. Verification includes unit coverage for Markdown loading, route resolution, localized external auth, return URL validation, and PL/EN lesson-pair validation by `lessonId`.

## What We're NOT Doing

- Not translating the Polish lesson prose automatically.
- Not introducing slug URLs in this plan.
- Not adding frontmatter slug generation.
- Not redirecting prework to `/courses/10xdevs-3/<lang>/prework`.
- Not creating or relying on `10xdevs-3/prework` as a nested course/resource path.
- Not merging prework into the main `10xdevs-3` resource.
- Not syncing prework Markdown with Circle. Local Markdown is the source of truth.
- Not adding Circle pull/push tooling, Circle lesson IDs, Circle section IDs, sync hashes, or Circle publication workflow.
- Not changing purchase/access semantics beyond reusing the existing `10XDEVS_3` permission for `10xdevs-3-prework`.
- Not using GitHub/Google OAuth for the 10xDevs 3 prework external login.
- Not expanding shared GUID Markdown support unless it becomes a separate requirement.

## Implementation Approach

Use the existing external-course architecture as the user-facing surface for prework. Add a bilingual Markdown-backed external route for `10xdevs-3-prework`, and keep `lessonId` as the stable lesson identifier until the product decision around slugs is revisited.

For content, generalize the Markdown lesson loader so it can support both:

- `10xdevs-3-prework` bilingual Markdown lessons.
- `10xdevs-3` Markdown-backed lessons or sections where needed.

For access, unauthenticated users visiting a prework lesson should be sent to `/external/10xdevs-3-prework/login?returnUrl=<encoded external lesson path>`. After verification, the learner returns to the exact localized lesson path.

## Critical Implementation Details

### Routing and URL Model

- Add bilingual prework lesson routes:
  - `/external/10xdevs-3-prework/pl/{lessonId}`
  - `/external/10xdevs-3-prework/en/{lessonId}`
- Keep `/external/10xdevs-3-prework/login` as the single login route.
- Do not add `/courses/10xdevs-3/pl/prework` or `/courses/10xdevs-3/en/prework`.
- Do not add `/external/10xdevs-3/prework`.
- Use `lessonId` from route params. For current Polish files this can remain the numeric filename prefix, such as `01`, `02`, `03`.
- If route files need to change, prefer an explicit nested route such as `src/pages/external/[courseId]/[lang]/[lessonId].astro` over ambiguous catch-all parsing.
- Keep existing `/external/[courseId]/[lessonId]` behavior for courses such as 10xDevs 2.

### Content Metadata Specification

Non-hidden Markdown lessons in bilingual prework collections should use this frontmatter shape:

```yaml
---
title: "[1.2] Chatbot vs Agent vs Harness - definicje"
lessonId: "02"
language: "pl"
order: 2
---
```

Rules:

- `lessonId` is required for every non-hidden lesson in bilingual prework Markdown collections.
- `language` is required and must be `pl` or `en`.
- Matching PL and EN lesson pairs must use the same `lessonId`.
- `order` controls course navigation order.
- Hidden/editorial files such as meta/style/todo files should either stay outside the loader glob or keep `hidden: true`.
- `slug` may remain optional in generic schemas for future compatibility, but this plan does not require or route by slug.

### Markdown-Backed External Resource Model

- Add a content-source abstraction or resolver capable of loading external lessons from Markdown.
- `10xdevs-3-prework` should resolve localized Markdown by `(courseId, lang, lessonId)`.
- `10xdevs-3` should be able to resolve Markdown-backed content where configured, without breaking any existing HTML-backed or Circle-backed external course behavior.
- Keep HTML-backed 10xDevs 2 behavior unchanged.
- Do not introduce live Circle calls for prework rendering.

### External Course Auth Redirect Model

- Unauthenticated prework lesson visits redirect to `/external/10xdevs-3-prework/login?returnUrl=<encoded-path>`.
- `validateReturnUrl()` must accept safe localized prework return paths:
  - `/external/10xdevs-3-prework/pl/{lessonId}`
  - `/external/10xdevs-3-prework/en/{lessonId}`
- Reject open redirects. Absolute external URLs, protocol-relative values, encoded external URLs, backslashes, malformed values, and unsupported internal paths must fall back to a safe `10xdevs-3-prework` location.
- Ensure `/external/10xdevs-3-prework/login`, `/api/external/auth`, and `/external/10xdevs-3-prework/verify` preserve return URLs with proper `encodeURIComponent()` handling.
- Do not route 10xDevs 3 prework auth through `/api/auth/github`, `/api/auth/google`, `/login`, or `/signup`.

### External Course Auth Localization Model

- Derive auth language from the safe return URL:
  - `/external/10xdevs-3-prework/pl/...` -> `pl`
  - `/external/10xdevs-3-prework/en/...` -> `en`
  - `/external/10xdevs-3-prework/login?lang=en` -> `en`, if the explicit language hint is validated.
  - Missing or invalid language -> `pl` by default.
- Pass the derived language from `src/pages/external/[courseId]/login.astro` into `ExternalLogin.svelte`.
- Localize visible external login copy, button labels, loading states, captcha errors, rate-limit messages, membership errors, and success messages.
- Send `{ email, courseId, returnUrl, lang }` to `/api/external/auth`, but validate server-side language from the sanitized return URL or safe language hint rather than trusting the client payload.
- Use the existing English external magic-link template by passing `lang: 'en'` to `sendMagicLinkEmail()` for English prework login.
- Keep `/external/[courseId]/verify` minimal, but preserve `returnUrl` in error redirects so the login page can render the correct language.

### State Management Sequencing

Access flow:

1. User opens `/external/10xdevs-3-prework/pl/02` or `/external/10xdevs-3-prework/en/02`.
2. If unauthenticated, the route redirects to `/external/10xdevs-3-prework/login?returnUrl=<encoded external lesson path>`.
3. External auth validates membership and sends a magic link in the language derived from the safe return URL.
4. Verification sets the unified `token` cookie and syncs access grants.
5. User returns to the exact localized external lesson path.
6. Access resolves through `10xdevs-3-prework`, which maps to `10XDEVS_3`.

## Phase 1: Markdown Loader and Metadata

### Overview

Extend the Markdown lesson model so bilingual external content can be loaded by Astro while preserving existing rendered lesson behavior.

### Changes Required

#### 1. Add a reusable Markdown lesson metadata model

File: `src/server/content/markdownLessonLoader.ts` or new `src/server/content/markdownLessonMetadata.ts`

Changes:

- Extend frontmatter parsing to support `lessonId`, `language`, and `order`.
- Keep optional `slug` fields harmless in the generic schema if already present, but do not require them.
- Validate required fields for non-hidden lessons when `idStrategy: 'frontmatterLessonId'` is enabled.
- Keep hidden file handling early so files like `00-meta_prework.md` can remain metadata-only.

#### 2. Add lessonId-based loader option

File: `src/server/content/markdownLessonLoader.ts`

Changes:

- Change the loader signature from `markdownLessonLoader(pattern: string)` to support:

```ts
markdownLessonLoader(pattern: string, options?: {
  idStrategy?: 'filenamePrefix' | 'frontmatterLessonId';
  defaultLanguage?: 'pl' | 'en';
})
```

- Preserve current behavior as the default for compatibility.
- For `frontmatterLessonId`, use `data.lessonId` as the returned entry `id`.
- Sort by numeric `order` first, then by `lessonId`.

#### 3. Extend content schema

File: `src/content.config.ts`

Changes:

- Extend the lesson schema with optional metadata fields used by Markdown lessons.
- Keep HTML collections compatible by making new fields optional.

### Success Criteria

Automated verification:

- [x] `npm run test -- src/server/content/markdownLessonLoader.test.ts`
- [x] `npm run build`
- [x] A fixture lesson with `lessonId: "02"` loads with entry ID `02`.
- [x] Hidden lessons do not require `lessonId`.
- [x] Missing `lessonId` in lessonId mode fails with a useful error.

Manual verification:

- [ ] No route behavior changes yet.
- [ ] Existing `/courses/10xdevs-3-prework` still builds before migration, if still registered.

Implementation note: Pause after this phase if loader validation affects any existing prework files unexpectedly.

---

## Phase 2: Bilingual External Prework Routing

### Overview

Register `10xdevs-3-prework` as a separate external resource with localized Markdown-backed lesson routes.

### Changes Required

#### 1. Add or confirm collection names

File: `src/models/LessonCollection.ts`

Changes:

- Add `lessons10xDevs3PreworkPl`.
- Add `lessons10xDevs3PreworkEn`.
- Keep existing collection names only if they remain needed for backward compatibility.

#### 2. Add resource mappings

Files:

- `src/models/CollectionMappings.ts`
- `src/server/circle/externalAuthConfig.ts`
- Any external-course content resolver/config files introduced by the implementation.

Changes:

- Keep `10xdevs-3-prework` as its own resource/course ID.
- Map `10xdevs-3-prework` to `10XDEVS_3`.
- Do not add `10xdevs-3/prework`.
- Do not add `10xdevs-3/pl/prework` or `10xdevs-3/en/prework`.
- Add display names if needed:
  - `10xDevs 3.0: Prework (PL)`
  - `10xDevs 3.0: Prework (EN)`

#### 3. Register collections

File: `src/content.config.ts`

Changes:

- Add `lessons10xDevs3PreworkPl` with `frontmatterLessonId` and `defaultLanguage: 'pl'`.
- Add `lessons10xDevs3PreworkEn` with `frontmatterLessonId` and `defaultLanguage: 'en'`.
- Export both collections.

#### 4. Add directories

Files:

- `src/content/lessons10xDevs3Prework/pl/`
- `src/content/lessons10xDevs3Prework/en/`

Changes:

- Create directory structure.
- Add `.gitkeep` only if the directory would otherwise be empty before migration.

#### 5. Add localized external prework route

File: new `src/pages/external/[courseId]/[lang]/[lessonId].astro`

Changes:

- Handle `courseId === '10xdevs-3-prework'`.
- Validate `lang` as `pl` or `en`.
- Resolve Markdown content by `(courseId, lang, lessonId)`.
- Verify access using `10xdevs-3-prework`.
- Redirect unauthenticated users to `/external/10xdevs-3-prework/login?returnUrl=<encoded current path>`.
- Return a 404 for unsupported language, missing lesson, or unsupported Markdown route combination.
- Preserve existing `/external/[courseId]/[lessonId]` route behavior for other courses.

### Success Criteria

Automated verification:

- [x] `npm run build`
- [x] `rg -n "10xdevs-3-prework" src/models src/content.config.ts src/server src/pages/external`
- [x] `rg -n "lessons10xDevs3PreworkPl|lessons10xDevs3PreworkEn" src/models src/content.config.ts`
- [x] Unit tests for external-course return URL validation, including safe `/external/10xdevs-3-prework/pl/...` and `/external/10xdevs-3-prework/en/...` paths.
- [x] Unit tests for open-redirect rejection.
- [x] Unit tests or focused route helper tests for unauthenticated redirect URL generation.

Manual verification:

- [ ] As an unauthenticated user, open `/external/10xdevs-3-prework/pl/02` and confirm redirect to `/external/10xdevs-3-prework/login?returnUrl=...`.
- [ ] As an unauthenticated user, open `/external/10xdevs-3-prework/en/02` and confirm redirect to the same login route with the EN return URL preserved.
- [ ] As a granted user, open a PL prework lesson and confirm Markdown renders.
- [ ] As a granted user, open a matching EN prework lesson and confirm Markdown renders.

Implementation note: Keep this phase routing-only. Do not migrate all lesson files in the same change if loader/schema changes still need review.

---

## Phase 3: Localized External Login

### Overview

Localize `/external/10xdevs-3-prework/login` and ensure prework auth preserves localized external return paths.

### Changes Required

#### 1. Preserve localized return paths through external-course auth

Files:

- `src/server/urlValidation.ts`
- `src/pages/external/[courseId]/login.astro`
- `src/pages/external/[courseId]/verify.astro`
- `src/pages/api/external/auth.ts`
- `src/components/ExternalLogin.svelte`

Changes:

- Add a helper such as `buildExternalCourseLoginUrl(Astro.url, '10xdevs-3-prework')`.
- Extend return URL validation for safe `/external/10xdevs-3-prework/pl/...` and `/external/10xdevs-3-prework/en/...` paths.
- Add `resolveExternalAuthLanguage(returnUrl, langHint): 'pl' | 'en'`.
- Pass resolved language into `ExternalLogin.svelte`.
- Replace hard-coded Polish external login copy with PL/EN dictionaries.
- Include `lang` in the `/api/external/auth` request body for client UX, but re-derive language server-side from the sanitized return URL or safe language hint.
- Pass resolved language to `sendMagicLinkEmail()`.
- Do not add GitHub/Google buttons or OAuth callback handling to this course-specific flow.

#### 2. Localize safe defaults

Files:

- `src/pages/external/[courseId]/login.astro`
- `src/server/urlValidation.ts`

Changes:

- Support `/external/10xdevs-3-prework/login?lang=en` for users who enter the login page directly.
- Fall back to Polish when neither return URL nor language hint provides a valid language.
- Fall back to a safe prework path, not the main `10xdevs-3` course, when return URL validation fails.

### Success Criteria

Automated verification:

- [x] Unit tests for `resolveExternalAuthLanguage()` from PL/EN prework return URLs.
- [x] Unit tests for `lang=en` direct-login fallback.
- [x] Component tests or lightweight rendering checks for PL/EN external login copy.
- [x] Existing `src/server/email/templates/magicLink.test.ts` passes for both languages.
- [x] `npm run build`

Manual verification:

- [ ] Confirm the PL external-course login screen shows Polish copy and no OAuth buttons.
- [ ] Confirm the EN external-course login screen shows English copy and no OAuth buttons.
- [ ] After external-course magic-link login, confirm the user lands back on `/external/10xdevs-3-prework/pl/{lessonId}`.
- [ ] From the EN prework login flow, confirm the magic-link email uses the English template.
- [ ] Confirm invalid return URL values such as `https://example.com`, `//example.com`, and `/api/logout` fall back to a safe `10xdevs-3-prework` location.

---

## Phase 4: Local Content Migration and Validation

### Overview

Move current Polish prework files into the PL directory, add required lessonId-mode metadata, and scaffold matching EN files. Local Markdown is the source of truth.

### Changes Required

#### 1. Move Polish lesson files

Files:

- From: `src/content/lessons10xDevs3Prework/*.md`
- To: `src/content/lessons10xDevs3Prework/pl/*.md`

Changes:

- Move only learner-facing lesson files.
- Keep editorial files such as `00-meta_prework.md`, `style.md`, `todo.md`, and `release-candidate-improvement-report.md` outside the loader glob, or mark them hidden and keep them in a non-loaded directory.
- Preserve `scenarios/` and `tmp/` as non-collection support directories.

#### 2. Add required frontmatter to PL lessons

Files: `src/content/lessons10xDevs3Prework/pl/*.md`

Changes:

- Add or preserve `lessonId` values based on current numeric lesson IDs.
- Add `language: "pl"` and `order`.
- Do not add `slug` as a required field. Example:

```yaml
---
title: "[1.2] Chatbot vs Agent vs Harness - definicje"
lessonId: "02"
language: "pl"
order: 2
---
```

#### 3. Create EN scaffold

Files: `src/content/lessons10xDevs3Prework/en/*.md`

Changes:

- Create matching files for every PL learner-facing lesson.
- Use the same `lessonId` and matching `order`.
- Set `language: "en"`.
- Leave English body as a placeholder or brief editorial marker, depending on team preference.

#### 4. Add PL/EN lesson-pair validation

File: new helper/test, for example `src/server/content/preworkLessonPairs.test.ts`

Changes:

- Confirm every non-hidden PL learner-facing `lessonId` has an EN counterpart.
- Confirm every non-hidden EN scaffold `lessonId` has a PL counterpart.
- Confirm no duplicate `lessonId` values within a language.
- Confirm `order` values are numeric and stable enough for navigation.

#### 5. Update meta/cookbook references

File: `src/content/lessons10xDevs3Prework/00-meta_prework.md` or moved editorial location

Changes:

- Update references from old course routes to `/external/10xdevs-3-prework/pl/{lessonId}` and `/external/10xdevs-3-prework/en/{lessonId}`.
- Document that PL and EN lessons must share `lessonId`.
- Document that local Markdown is canonical and there is no Circle sync step.

### Success Criteria

Automated verification:

- [x] `npm run build`
- [x] `npm run test -- src/server/content/markdownLessonLoader.test.ts`
- [x] `npm run test -- src/server/content/preworkLessonPairs.test.ts`
- [x] `find src/content/lessons10xDevs3Prework/pl -name "*.md" | wc -l`
- [x] `find src/content/lessons10xDevs3Prework/en -name "*.md" | wc -l`

Manual verification:

- [ ] Open `/external/10xdevs-3-prework/pl/02` as a granted user and confirm the PL lesson renders.
- [ ] Open `/external/10xdevs-3-prework/en/02` as a granted user and confirm the EN scaffold lesson renders without crashing.
- [ ] Confirm prev/next links, if present, use localized external URLs with `lessonId`.
- [ ] Confirm editorial/support files do not appear as learner lessons.

Implementation note: This phase changes many content file paths. Review carefully to avoid moving support files into the collection glob accidentally.

---

## Phase 5: Markdown Support for `10xdevs-3`

### Overview

Make the main `10xdevs-3` resource capable of rendering Markdown-backed lessons or sections where configured, without forcing it into the HTML-only model used by 10xDevs 2.

### Changes Required

#### 1. Add Markdown-capable content resolver

Files:

- Existing external lesson resolver files, or new `src/server/content/externalMarkdownContent.ts`
- `src/content.config.ts`
- `src/models/LessonCollection.ts`

Changes:

- Add a resolver that can choose Markdown content for configured resources.
- Keep HTML content and Circle-backed external content behavior unchanged for existing courses.
- Ensure `10xdevs-3` can opt into Markdown-backed content without changing the prework route model.

#### 2. Register `10xdevs-3` Markdown collection if needed

Files:

- `src/content/lessons10xDevs3/`
- `src/content.config.ts`

Changes:

- Confirm whether `lessons10xDevs3` already exists as Markdown, HTML, or mixed content.
- If Markdown is needed, register it with a compatible metadata model.
- Keep lesson IDs stable and do not introduce slugs unless a separate plan approves that change.

#### 3. Add tests around mixed source support

Files:

- New or existing tests for the external content resolver.

Changes:

- Verify Markdown-backed `10xdevs-3-prework` resolution.
- Verify Markdown-backed `10xdevs-3` resolution where configured.
- Verify HTML-backed `10xdevs-2` behavior remains unchanged.
- Verify unsupported combinations return a controlled not-found result.

### Success Criteria

Automated verification:

- [x] `npm run test`
- [x] `npm run build`
- [x] Focused tests prove `10xdevs-3-prework` and `10xdevs-3` can resolve Markdown-backed content.
- [x] Focused tests prove existing HTML-backed 10xDevs 2 routes still resolve as before.

Manual verification:

- [ ] Open a Markdown-backed `10xdevs-3-prework` lesson.
- [ ] Open a Markdown-backed `10xdevs-3` lesson or page if configured.
- [ ] Open an existing HTML-backed 10xDevs 2 external lesson and confirm it still renders.

---

## Deferred: Slug URLs

Slug URLs are intentionally deferred. When this is revisited, create a separate plan for:

- Generating stable ASCII slugs.
- Adding `slug` frontmatter.
- Mapping legacy numeric IDs to slugs.
- Redirecting old `lessonId` URLs.
- Validating PL/EN slug pairs.

Until then, all prework route and validation logic should use `lessonId`.

## Testing Strategy

Unit tests:

- Markdown loader lessonId mode:
  - hidden files are skipped
  - missing `lessonId` fails
  - `lessonId` becomes entry ID
  - `order` controls sort
- Resource mapping:
  - `10xdevs-3-prework` maps to the correct PL/EN Markdown collections
  - `10xdevs-3-prework` maps to `10XDEVS_3`
  - `10xdevs-3` can opt into Markdown-backed content where configured
- External-course auth redirect handling:
  - unauthenticated prework routes redirect to `/external/10xdevs-3-prework/login?returnUrl=<encoded localized path>`
  - return URL validation accepts safe `/external/10xdevs-3-prework/pl/...` and `/external/10xdevs-3-prework/en/...` paths
  - return URL validation rejects external, protocol-relative, and unsupported internal paths
  - external magic-link verification preserves localized return paths
- External-course auth localization:
  - `resolveExternalAuthLanguage()` derives `pl` / `en` from safe prework return URLs
  - direct login can use a safe `lang=en` hint
  - external-course login UI renders Polish for PL prework and English for EN prework
  - `/api/external/auth` sends Polish or English external magic-link email based on validated language
  - no OAuth UI or OAuth callback path is used for 10xDevs 3 prework auth
- Content migration:
  - PL/EN `lessonId` pairs match
  - duplicate `lessonId` values are rejected
  - editorial/support files stay out of the learner-facing collection
- Mixed source support:
  - Markdown-backed prework resolves by `(courseId, lang, lessonId)`
  - Markdown-backed main `10xdevs-3` content resolves where configured
  - existing HTML-backed routes remain stable

Integration tests:

- No dedicated Astro route integration test harness exists today.
- Treat `npm run build` plus manual route smoke tests as the practical route integration check.
- No Circle live calls are required for prework content because local Markdown is canonical.

Manual testing steps:

1. Run `npm run build`.
2. Run `npm run test`.
3. Start local dev server with `npm run dev`.
4. Log in as a user with `10XDEVS_3` access.
5. Visit `/external/10xdevs-3-prework/pl/02`.
6. Visit `/external/10xdevs-3-prework/en/02`.
7. In a private browser session, visit a PL lesson URL and confirm `/external/10xdevs-3-prework/login?returnUrl=...` preserves the exact external lesson path and renders Polish auth copy.
8. In a private browser session, visit an EN lesson URL and confirm `/external/10xdevs-3-prework/login?returnUrl=...` preserves the exact external lesson path, renders English auth copy, and shows no OAuth buttons.
9. Complete external-course magic-link login from an EN lesson URL and confirm the email/login flow is English and returns to the localized lesson.
10. Confirm direct invalid return URLs to `/external/10xdevs-3-prework/login` fall back to a safe prework location.
11. Open a configured Markdown-backed `10xdevs-3` page or lesson.
12. Open an existing HTML-backed 10xDevs 2 external lesson and confirm it still renders.

## Performance Considerations

- Lesson metadata parsing happens at build/dev loader time and is negligible for this content set.
- Local content validation is tiny: roughly tens of Markdown files.
- No Circle API calls are introduced for prework content rendering or migration.
- Markdown support for `10xdevs-3` should be resolver-level configuration, not a live runtime scan of the filesystem.

## Migration Notes

- Existing old links must not be deleted until an explicit legacy compatibility decision is made.
- Existing shared GUID mappings currently only scan `.html` files in `scripts/generate-guid-mappings.ts`, so Markdown prework lessons will not receive shared GUID mappings unless that generator is expanded later. This plan does not include that work.
- `10xdevs-3-prework` stays in the type system as the canonical prework resource, not as a temporary legacy slug.
- 10xDevs 3 prework should use external-course magic-link auth. The general `/login` and OAuth-capable flow remains unchanged for other platform areas.
- The plan filename still contains `circle-sync` for continuity with existing implementation state, but the plan scope no longer includes Circle sync.

## References

- Prework collection: `src/content.config.ts`
- Markdown loader: `src/server/content/markdownLessonLoader.ts`
- Course mappings: `src/models/CollectionMappings.ts`
- Lesson collection type: `src/models/LessonCollection.ts`
- External login page: `src/pages/external/[courseId]/login.astro`
- External lesson route: `src/pages/external/[courseId]/[lessonId].astro`
- External localized prework route: `src/pages/external/[courseId]/[lang]/[lessonId].astro`
- External login component: `src/components/ExternalLogin.svelte`
- External auth API: `src/pages/api/external/auth.ts`
- External verify page: `src/pages/external/[courseId]/verify.astro`
- External return URL validation: `src/server/urlValidation.ts`
- External auth config: `src/server/circle/externalAuthConfig.ts`
- Prior 10xDevs 3 plan: `thoughts/shared/plans/2026-04-14-10xdevs-3-course-introduction.md`
- Prior Mermaid/prework plan: `thoughts/shared/plans/2026-04-18-mermaid-rendering-in-prework-lessons.md`

<!-- PLAN STATUS: Last Phase Completed: 5, Next Phase: Manual Verification, Updated: 2026-04-27 -->
