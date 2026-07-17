Skipping opanuj-typescript (not affected)
Skipping opanuj-frontend (not affected)
Skipping 10x-assistant (not affected)
Deploy edu-platform to production
✅ > nx run @przeprogramowani/common:build
[sentry-vite-plugin] Info: Sending telemetry data on issues and performance to Sentry. To disable telemetry, set `options.telemetry` to `false`.
21:17:43 [vite] Re-optimizing dependencies because vite config has changed
21:17:44 [content] Syncing content
21:17:44 [content] Astro config changed
21:17:44 [content] Content config changed
21:17:44 [content] Clearing content store
21:17:46 [content] Synced content
21:17:46 [types] Generated 2.45s
21:17:46 [check] Getting diagnostics for Astro files in /home/runner/work/przeprogramowani-sites/przeprogramowani-sites/projects/edu-platform...
src/components/CourseList.astro:17:7 - warning ts(6133): 'isAdmin' is declared but its value is never read.
17 const isAdmin = ADMIN_EMAILS.includes(userEmail);
         ~~~~~~~
src/components/sidebar/SidebarToggle.test.ts:80:33 - warning ts(6385): 'EXTERNAL_SIDEBAR_STORAGE_KEY' is deprecated.
80     expect(localStorage.getItem(EXTERNAL_SIDEBAR_STORAGE_KEY)).toBeNull();
                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/components/sidebar/SidebarToggle.test.ts:75:26 - warning ts(6385): 'EXTERNAL_SIDEBAR_STORAGE_KEY' is deprecated.
75     localStorage.setItem(EXTERNAL_SIDEBAR_STORAGE_KEY, 'true');
                            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/components/sidebar/SidebarToggle.test.ts:5:31 - warning ts(6385): 'EXTERNAL_SIDEBAR_STORAGE_KEY' is deprecated.
5 import { SIDEBAR_STORAGE_KEY, EXTERNAL_SIDEBAR_STORAGE_KEY } from '@/lib/topBarHelpers';
                                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/explorers/arcade/MemoryMatrixRenderer.ts:46:11 - warning ts(6133): 'bounds' is declared but its value is never read.
46   private bounds!: Phaser.Geom.Rectangle;
             ~~~~~~
src/explorers/arcade/MemoryMatrixRenderer.ts:45:11 - warning ts(6133): 'config' is declared but its value is never read.
45   private config!: ArcadeGameDefinition;
             ~~~~~~
src/explorers/arcade/OscilloscopeRenderer.ts:90:11 - warning ts(6133): 'config' is declared but its value is never read.
90   private config!: ArcadeGameDefinition;
             ~~~~~~
src/explorers/scenes/DialogueScene.ts:4:1 - warning ts(6133): 'SYSTEM_MESSAGE_DURATION_MS' is declared but its value is never read.
4 import { SYSTEM_MESSAGE_DURATION_MS } from '../config/constants';
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/explorers/scenes/ExamScene.ts:510:11 - warning ts(6133): 'panelLeft' is declared but its value is never read.
510     const panelLeft = panelX - panelW / 2;
              ~~~~~~~~~
src/explorers/scenes/GameScene.ts:832:36 - warning ts(6133): 'map' is declared but its value is never read.
832   private resolveSafeSpawnPosition(map: Phaser.Tilemaps.Tilemap): { x: number; y: number } {
                                       ~~~
src/explorers/scenes/GameScene.ts:385:25 - warning ts(6133): 's' is declared but its value is never read.
385       this.updateState((s) => ({
                            ~
src/explorers/scenes/GameScene.ts:360:27 - warning ts(6133): 's' is declared but its value is never read.
360         this.updateState((s) => ({
                              ~
src/explorers/scenes/TransitionScene.ts:52:23 - warning ts(6133): 's' is declared but its value is never read.
52     this.updateState((s) => ({
                         ~
src/explorers/state/actorMovementBounds.ts:29:47 - warning ts(6133): 'tileSize' is declared but its value is never read.
29 function getBodyRect(position: ActorPosition, tileSize: number) {
                                                 ~~~~~~~~
src/layouts/LayoutScripts.astro:160:22 - warning ts(6387): The signature '(commandId: string, showUI?: boolean | undefined, value?: string | undefined): boolean' of 'document.execCommand' is deprecated.
160             document.execCommand('copy');
                         ~~~~~~~~~~~
src/lib/topBarHelpers.test.ts:102:12 - warning ts(6385): 'EXTERNAL_SIDEBAR_STORAGE_KEY' is deprecated.
102     expect(EXTERNAL_SIDEBAR_STORAGE_KEY).toBe('external-sidebar-collapsed');
               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/lib/topBarHelpers.test.ts:7:3 - warning ts(6385): 'EXTERNAL_SIDEBAR_STORAGE_KEY' is deprecated.
7   EXTERNAL_SIDEBAR_STORAGE_KEY,
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/pages/login.astro:5:1 - warning ts(6133): 'resolveRedirect' is declared but its value is never read.
5 import { resolveRedirect } from '@/server/redirects';
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/pages/signup.astro:5:1 - warning ts(6133): 'resolveRedirect' is declared but its value is never read.
5 import { resolveRedirect } from '@/server/redirects';
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/pages/verify.astro:19:7 - warning ts(6133): 'errorRedirectSuffix' is declared but its value is never read.
19 const errorRedirectSuffix = redirectParam ? `&redirect=${redirectParam}` : '';
         ~~~~~~~~~~~~~~~~~~~
src/pages/verify.astro:10:1 - warning ts(6133): 'resolveRedirect' is declared but its value is never read.
10 import { resolveRedirect } from '@/server/redirects';
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/pages/10xdevs-3/ebook/markdown.astro:30:7 - warning ts(6133): 'frontmatter' is declared but its value is never read.
30 const frontmatter = `---
         ~~~~~~~~~~~
src/pages/10xdevs-3/ebook/markdown.astro:27:7 - warning ts(6133): 'filename' is declared but its value is never read.
27 const filename = url.searchParams.get('filename') || DEFAULT_FILENAME;
         ~~~~~~~~
src/pages/10xdevs-3/ebook/markdown.astro:4:1 - warning ts(6133): 'buildAttachmentContentDisposition' is declared but its value is never read.
4 import { buildAttachmentContentDisposition } from '@/utils/contentDisposition';
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/pages/api/customer-purchases.ts:5:44 - warning ts(6133): 'locals' is declared but its value is never read.
5 export const GET: APIRoute = async ({ url, locals }: APIContext) => {
                                             ~~~~~~
src/pages/api/external/auth.ts:2:1 - warning ts(6133): 'verifyCaptcha' is declared but its value is never read.
2 import { verifyCaptcha } from '@/server/verifyCaptcha';
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/pages/courses/[...courseSlug]/lesson/[...id].astro:18:9 - warning ts(6133): 'suffix' is declared but its value is never read.
18   const suffix = legacyLessonId ? `/pl/${legacyLessonId}` : '';
           ~~~~~~
src/pages/courses/[...courseSlug]/lesson/[...id].astro:12:9 - warning ts(6133): 'suffix' is declared but its value is never read.
12   const suffix = legacyLessonId ? `/pl/${legacyLessonId}` : '';
           ~~~~~~
src/pages/external/10xdevs-2/checklists/[slug].astro:27:9 - warning ts(6133): 'returnUrl' is declared but its value is never read.
27   const returnUrl = encodeURIComponent(Astro.url.pathname);
           ~~~~~~~~~
src/pages/external/10xdevs-2/checklists/index.astro:16:9 - warning ts(6133): 'returnUrl' is declared but its value is never read.
16   const returnUrl = encodeURIComponent(Astro.url.pathname);
           ~~~~~~~~~
src/pages/external/10xdevs-2/checklists/[slug]/markdown.astro:66:7 - warning ts(6133): 'finalContent' is declared but its value is never read.
66 const finalContent = frontmatter + markdownContent;
         ~~~~~~~~~~~~
src/pages/external/10xdevs-2/checklists/[slug]/markdown.astro:37:7 - warning ts(6133): 'filename' is declared but its value is never read.
37 const filename = url.searchParams.get('filename') || defaultFilename;
         ~~~~~~~~
src/pages/external/10xdevs-2/checklists/[slug]/markdown.astro:5:1 - warning ts(6133): 'buildAttachmentContentDisposition' is declared but its value is never read.
5 import { buildAttachmentContentDisposition } from '@/utils/contentDisposition';
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/pages/external/[courseId]/[lessonId].astro:23:1 - warning ts(6133): 'buildExternalCourseLoginUrl' is declared but its value is never read.
23 import { buildExternalCourseLoginUrl } from '@/server/urlValidation';
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/pages/external/[courseId]/index.astro:13:1 - warning ts(6133): 'buildExternalCourseLoginUrl' is declared but its value is never read.
13 import { buildExternalCourseLoginUrl } from '@/server/urlValidation';
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/pages/external/[courseId]/verify.astro:22:7 - warning ts(6133): 'buildLoginRedirect' is declared but its value is never read.
22 const buildLoginRedirect = (error: string) => {
         ~~~~~~~~~~~~~~~~~~
src/pages/external/[courseId]/[lang]/[lessonId].astro:24:1 - warning ts(6133): 'buildExternalCourseLoginUrl' is declared but its value is never read.
24 import { buildExternalCourseLoginUrl } from '@/server/urlValidation';
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/pages/external/[courseId]/[lang]/quiz.astro:12:1 - warning ts(6133): 'buildExternalCourseLoginUrl' is declared but its value is never read.
12 import { buildExternalCourseLoginUrl } from '@/server/urlValidation';
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/pages/external/[courseId]/[lang]/[lessonId]/markdown.astro:43:7 - warning ts(6133): 'markdownContent' is declared but its value is never read.
43 const markdownContent = buildLocalizedPreworkMarkdownExport({
         ~~~~~~~~~~~~~~~
src/pages/external/[courseId]/[lang]/[lessonId]/markdown.astro:42:7 - warning ts(6133): 'filename' is declared but its value is never read.
42 const filename = url.searchParams.get('filename') || slugify(lesson.data.name);
         ~~~~~~~~
src/pages/external/[courseId]/[lang]/[lessonId]/markdown.astro:16:1 - warning ts(6133): 'buildExternalCourseLoginUrl' is declared but its value is never read.
16 import { buildExternalCourseLoginUrl } from '@/server/urlValidation';
   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/pages/external/[courseId]/[lang]/[lessonId]/markdown.astro:2:1 - warning ts(6133): 'buildAttachmentContentDisposition' is declared but its value is never read.
2 import { buildAttachmentContentDisposition } from '@/utils/contentDisposition';
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/pages/external/[courseId]/[lessonId]/markdown.astro:67:7 - warning ts(6133): 'finalContent' is declared but its value is never read.
67 const finalContent = frontmatter + markdownContent;
         ~~~~~~~~~~~~
src/pages/external/[courseId]/[lessonId]/markdown.astro:51:7 - warning ts(6133): 'filename' is declared but its value is never read.
51 const filename = url.searchParams.get('filename') || 'lesson';
         ~~~~~~~~
src/pages/external/[courseId]/[lessonId]/markdown.astro:26:9 - warning ts(6133): 'returnUrl' is declared but its value is never read.
26   const returnUrl = encodeURIComponent(`/external/${courseId}/${lessonId}`);
           ~~~~~~~~~
src/pages/external/[courseId]/[lessonId]/markdown.astro:8:1 - warning ts(6133): 'buildAttachmentContentDisposition' is declared but its value is never read.
8 import { buildAttachmentContentDisposition } from '@/utils/contentDisposition';
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/pages/shared/[guid]/markdown.astro:53:7 - warning ts(6133): 'finalContent' is declared but its value is never read.
53 const finalContent = frontmatter + markdownContent;
         ~~~~~~~~~~~~
src/pages/shared/[guid]/markdown.astro:37:7 - warning ts(6133): 'filename' is declared but its value is never read.
37 const filename = url.searchParams.get('filename') || 'lesson';
         ~~~~~~~~
src/pages/shared/[guid]/markdown.astro:7:1 - warning ts(6133): 'buildAttachmentContentDisposition' is declared but its value is never read.
7 import { buildAttachmentContentDisposition } from '@/utils/contentDisposition';
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
src/server/content/lessonHtmlPostProcessing.test.ts:2:59 - warning ts(6133): 'PREWORK_BASE_URL' is declared but its value is never read.
2 import { replaceMermaidWithCdnImages, injectPreworkLinks, PREWORK_BASE_URL } from './lessonHtmlPostProcessing';
                                                            ~~~~~~~~~~~~~~~~
src/utils/extractHeadingsFromMarkdown.ts:6:24 - warning ts(6196): 'Text' is declared but never used.
6 import type { Heading, Text } from 'mdast';
                         ~~~~
workbench/scripts/render-mermaid.mjs:24:10 - warning ts(6133): 'basename' is declared but its value is never read.
24 import { basename, dirname, extname, join, relative, resolve } from 'node:path';
            ~~~~~~~~
workbench/scripts/transform-diagrams-10x.mjs:471:11 - warning ts(6133): 'usedModel' is declared but its value is never read.
471       let usedModel = model;
              ~~~~~~~~~
workbench/scripts/transform-diagrams-10x.mjs:21:20 - warning ts(6133): 'dirname' is declared but its value is never read.
21 import { basename, dirname, extname, join, relative, resolve } from 'node:path';
                      ~~~~~~~
workbench/scripts/transform-diagrams-10x.mjs:21:10 - warning ts(6133): 'basename' is declared but its value is never read.
21 import { basename, dirname, extname, join, relative, resolve } from 'node:path';
            ~~~~~~~~
Result (380 files): 
- 0 errors
- 0 warnings
- 55 hints


> nx run edu-platform:build

> edu-platform@0.0.1 build
> npm run check:lesson-html && rm -f .astro/data-store.json node_modules/.astro/data-store.json && astro build && npm run check:build-content
> edu-platform@0.0.1 check:lesson-html
> tsx scripts/generate-lesson-html.ts --check && tsx scripts/enrich-lesson-html.ts --check --lang en && npm run report:prework-code-blocks
Generated lesson HTML is up to date (20 files checked).
Enriched lesson HTML metadata is up to date (20 files checked).
> edu-platform@0.0.1 report:prework-code-blocks
> tsx scripts/repair-prework-code-blocks.ts --report
Prework code block repair: report
Issues: 0
Actions: 0 code repaired/planned, 0 Mermaid restored/planned, 0 missing
Cache/API: 0 cache hits, 0 cache misses, 0 API requests
No suspicious or missing prework code blocks found.
21:18:14 [WARN] [@sentry/astro] You passed in additional options (dsn) to the Sentry integration. This is deprecated and will stop working in a future version. Instead, configure the Sentry SDK in your `sentry.client.config.(js|ts)` or `sentry.server.config.(js|ts)` files.
[sentry-vite-plugin] Info: Sending telemetry data on issues and performance to Sentry. To disable telemetry, set `options.telemetry` to `false`.
21:18:15 [content] Syncing content
21:18:17 [content] Synced content
21:18:17 [types] Generated 2.06s
21:18:17 [build] output: "server"
21:18:17 [build] directory: /home/runner/work/przeprogramowani-sites/przeprogramowani-sites/projects/edu-platform/dist/
21:18:17 [build] adapter: @astrojs/cloudflare
21:18:17 [build] Collecting build info...
21:18:17 [build] ✓ Completed in 2.13s.
21:18:17 [build] Building server entrypoints...
[sentry-vite-plugin] Info: Sending telemetry data on issues and performance to Sentry. To disable telemetry, set `options.telemetry` to `false`.
[sentry-vite-plugin] Error: An error occurred. Couldn't finish all operations: Error: Command failed: /home/runner/work/przeprogramowani-sites/przeprogramowani-sites/node_modules/@sentry/cli-linux-x64/bin/sentry-cli --header sentry-trace:5c3c3cf4fb2f49f3b7e72dd4a5fe97e9-84f20d73f5002adc releases new 5755bd842af6d2ab606efedfa3919e745af86689
error: Project not found. Ensure that you configured the correct project and organization.
Add --log-level=[info|debug] or export SENTRY_LOG_LEVEL=[info|debug] to see more output.
Please attach the full debug log to all bug reports.
    at genericNodeError (node:internal/errors:983:15)
    at wrappedFn (node:internal/errors:537:14)
    at ChildProcess.exithandler (node:child_process:417:12)
    at ChildProcess.emit (node:events:519:28)
    at ChildProcess.emit (node:domain:489:12)
    at maybeClose (node:internal/child_process:1101:16)
    at ChildProcess._handle.onexit (node:internal/child_process:304:5) {
  code: 1,
  killed: false,
  signal: null,
  cmd: '/home/runner/work/przeprogramowani-sites/przeprogramowani-sites/node_modules/@sentry/cli-linux-x64/bin/sentry-cli --header sentry-trace:5c3c3cf4fb2f49f3b7e72dd4a5fe97e9-84f20d73f5002adc releases new 5755bd842af6d2ab606efedfa3919e745af86689'
}
> Found 306 files
> Analyzing 306 sources
> Analyzing completed in 0.018s
> Adding source map references
> Bundling completed in 0.82s
> Bundled 306 files for upload
> Bundle ID: 3da6ac29-e610-5a61-a708-4c49a6cc99b5
> Optimizing completed in 0.016s
error: API request failed
Caused by:
    sentry reported an error: One or more projects are invalid (http status: 400)
Add --log-level=[info|debug] or export SENTRY_LOG_LEVEL=[info|debug] to see more output.
Please attach the full debug log to all bug reports.
[sentry-vite-plugin] Error: An error occurred. Couldn't finish all operations: Error: Command --header sentry-trace:99e932bdf627413ba22407f2075c3605-8dc21718db3b9b7f-1 --header baggage:sentry-environment=production,sentry-release=5.2.1,sentry-public_key=4c2bae7d9fbc413e8f7385f55c515d51,sentry-trace_id=99e932bdf627413ba22407f2075c3605,sentry-sample_rate=1,sentry-transaction=Sentry%20Bundler%20Plugin%20execution,sentry-sampled=true sourcemaps upload -p javascript-astro --release 5755bd842af6d2ab606efedfa3919e745af86689 /tmp/sentry-bundler-plugin-upload-7qq3qB --ignore node_modules --no-rewrite failed with exit code 1
    at ChildProcess.<anonymous> (/home/runner/work/przeprogramowani-sites/przeprogramowani-sites/node_modules/@sentry/cli/js/helper.js:321:32)
    at ChildProcess.emit (node:events:519:28)
    at ChildProcess.emit (node:domain:489:12)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12)
21:18:42 [vite] ✓ built in 25.77s
21:18:42 [build] ✓ Completed in 25.84s.
 building client (vite) 
[sentry-vite-plugin] Info: Sending telemetry data on issues and performance to Sentry. To disable telemetry, set `options.telemetry` to `false`.
21:18:42 [vite] transforming...
21:19:01 [vite] ✓ 2651 modules transformed.
21:19:07 [vite] rendering chunks...
21:19:20 [vite] computing gzip size...
21:19:20 [vite] dist/_astro/index.BGP_IR6B.css                                                  0.20 kB │ gzip:   0.15 kB
21:19:20 [vite] dist/_astro/index.IN1601bJ.css                                                  0.75 kB │ gzip:   0.23 kB
21:19:20 [vite] dist/_astro/PhaserGame.CC7Apvnd.css                                             7.23 kB │ gzip:   1.86 kB
21:19:20 [vite] dist/_astro/clone.KuAhzspt.js                                                   0.51 kB │ gzip:   0.34 kB │ map:      1.40 kB
21:19:20 [vite] dist/_astro/channel.CrUdwyhT.js                                                 0.53 kB │ gzip:   0.36 kB │ map:      0.54 kB
21:19:20 [vite] dist/_astro/init.sIRf0F8J.js                                                    0.56 kB │ gzip:   0.36 kB │ map:      1.04 kB
21:19:20 [vite] dist/_astro/CourseLayout.astro_astro_type_script_index_0_lang.VN_05nst.js       0.57 kB │ gzip:   0.38 kB │ map:      4.76 kB
21:19:20 [vite] dist/_astro/chunk-QZHKN3VN.tXbGK8KK.js                                          0.61 kB │ gzip:   0.39 kB │ map:      0.84 kB
21:19:20 [vite] dist/_astro/chunk-4BX2VUAB.BTwp6CB9.js                                          0.64 kB │ gzip:   0.40 kB │ map:      0.86 kB
21:19:20 [vite] dist/_astro/chunk-55IACEB6.DHcJH21O.js                                          0.65 kB │ gzip:   0.44 kB │ map:      1.08 kB
21:19:20 [vite] dist/_astro/SidebarToggle.Bk9IICEU.js                                           0.73 kB │ gzip:   0.45 kB │ map:      0.11 kB
21:19:20 [vite] dist/_astro/this.BndG1-Tu.js                                                    0.73 kB │ gzip:   0.45 kB │ map:      3.06 kB
21:19:20 [vite] dist/_astro/useCaptcha.svelte.DSJ4eduF.js                                       0.77 kB │ gzip:   0.49 kB │ map:      1.31 kB
21:19:20 [vite] dist/_astro/chunk-FMBD7UC4.CgUji7Tc.js                                          0.78 kB │ gzip:   0.50 kB │ map:      0.83 kB
21:19:20 [vite] dist/_astro/stateDiagram-v2-QKLJ7IA2.CfMjAU8k.js                                0.86 kB │ gzip:   0.53 kB │ map:      1.53 kB
21:19:20 [vite] dist/_astro/LessonSidebar.BYpTDoUc.js                                           0.87 kB │ gzip:   0.51 kB │ map:      0.11 kB
21:19:20 [vite] dist/_astro/ContentTopBar.BxUU93eU.js                                           0.88 kB │ gzip:   0.52 kB │ map:      0.11 kB
21:19:20 [vite] dist/_astro/style.BFewOqXx.js                                                   0.90 kB │ gzip:   0.54 kB │ map:      2.67 kB
21:19:20 [vite] dist/_astro/chunk-EDXVE4YY.DffVbrI-.js                                          0.92 kB │ gzip:   0.59 kB │ map:      2.30 kB
21:19:20 [vite] dist/_astro/classDiagram-6PBFFD2Q.DgeKcKHG.js                                   0.93 kB │ gzip:   0.57 kB │ map:      1.58 kB
21:19:20 [vite] dist/_astro/classDiagram-v2-HSJHXN6E.epk1qLqF.js                                0.93 kB │ gzip:   0.57 kB │ map:      1.59 kB
21:19:20 [vite] dist/_astro/min.Dsugg89x.js                                                     1.01 kB │ gzip:   0.59 kB │ map:      6.38 kB
21:19:20 [vite] dist/_astro/_commonjsHelpers.Bpnb55vw.js                                        1.03 kB │ gzip:   0.56 kB │ map:      0.11 kB
21:19:20 [vite] dist/_astro/infoDiagram-42DDH7IO.BfOrLP9W.js                                    1.11 kB │ gzip:   0.68 kB │ map:      2.28 kB
21:19:20 [vite] dist/_astro/index-client.CUnUZlg9.js                                            1.11 kB │ gzip:   0.65 kB │ map:     12.94 kB
21:19:20 [vite] dist/_astro/input.BOaJcbGM.js                                                   1.20 kB │ gzip:   0.65 kB │ map:      9.18 kB
21:19:20 [vite] dist/_astro/preload-helper.CDLneLD5.js                                          1.53 kB │ gzip:   0.88 kB │ map:      0.11 kB
21:19:20 [vite] dist/_astro/client.svelte.X-McnD1V.js                                           1.55 kB │ gzip:   0.84 kB │ map:      8.21 kB
21:19:20 [vite] dist/_astro/ordinal.BoI07iat.js                                                 1.60 kB │ gzip:   0.80 kB │ map:      5.10 kB
21:19:20 [vite] dist/_astro/LessonNavigationLabel.DoM4rYkw.js                                   1.76 kB │ gzip:   0.98 kB │ map:      1.56 kB
21:19:20 [vite] dist/_astro/externalLessonShellCopy.D4j2WYYV.js                                 1.85 kB │ gzip:   0.91 kB │ map:      5.55 kB
21:19:20 [vite] dist/_astro/SidebarToggle.CAocqWk3.js                                           2.04 kB │ gzip:   1.18 kB │ map:      3.62 kB
21:19:20 [vite] dist/_astro/render.Dsmts4ld.js                                                  2.06 kB │ gzip:   1.16 kB │ map:     22.86 kB
21:19:20 [vite] dist/_astro/constants.BtcyhEEb.js                                               2.20 kB │ gzip:   1.31 kB │ map:     11.36 kB
21:19:20 [vite] dist/_astro/attributes.BvkJ_bru.js                                              2.21 kB │ gzip:   1.22 kB │ map:     29.00 kB
21:19:20 [vite] dist/_astro/chunk-YZCP3GAM.D5JibFs_.js                                          2.29 kB │ gzip:   1.06 kB │ map:      6.93 kB
21:19:20 [vite] dist/_astro/class.1Ir-p79m.js                                                   2.45 kB │ gzip:   1.29 kB │ map:     12.07 kB
21:19:20 [vite] dist/_astro/NewMapModal.Bt3loEuK.js                                             2.47 kB │ gzip:   1.17 kB │ map:      3.17 kB
21:19:20 [vite] dist/_astro/diagram-5BDNPKRD.BkDS0IoI.js                                        3.28 kB │ gzip:   1.64 kB │ map:     10.65 kB
21:19:20 [vite] dist/_astro/each.CqfjYj1U.js                                                    3.53 kB │ gzip:   1.82 kB │ map:     23.91 kB
21:19:20 [vite] dist/_astro/LessonProgressToggle.Cth1VGVZ.js                                    3.54 kB │ gzip:   1.75 kB │ map:      6.78 kB
21:19:20 [vite] dist/_astro/props.1XMMRO0w.js                                                   3.58 kB │ gzip:   1.82 kB │ map:     33.89 kB
21:19:20 [vite] dist/_astro/arc.BkJEYqub.js                                                     3.84 kB │ gzip:   1.70 kB │ map:     16.96 kB
21:19:20 [vite] dist/_astro/LayoutScripts.astro_astro_type_script_index_0_lang.dYtsP1xY.js      4.54 kB │ gzip:   1.88 kB │ map:     63.69 kB
21:19:20 [vite] dist/_astro/diagram-TYMM5635.S75ROzpm.js                                        4.73 kB │ gzip:   2.11 kB │ map:     13.63 kB
21:19:20 [vite] dist/_astro/defaultLocale.CXOguaQy.js                                           5.10 kB │ gzip:   2.40 kB │ map:     22.39 kB
21:19:20 [vite] dist/_astro/ExternalLogin.BgbVS4A3.js                                           5.16 kB │ gzip:   2.50 kB │ map:      8.07 kB
21:19:20 [vite] dist/_astro/Login.eZmTq_iE.js                                                   5.62 kB │ gzip:   2.72 kB │ map:      7.43 kB
21:19:20 [vite] dist/_astro/pieDiagram-DEJITSTG.IBJjeNa9.js                                     5.79 kB │ gzip:   2.61 kB │ map:     19.36 kB
21:19:20 [vite] dist/_astro/linear.C1TbuP6x.js                                                  6.08 kB │ gzip:   2.54 kB │ map:     27.35 kB
21:19:20 [vite] dist/_astro/SignupForm.C3UHoLCj.js                                              6.30 kB │ gzip:   3.03 kB │ map:      8.41 kB
21:19:20 [vite] dist/_astro/diagram-MMDJMWI5.mLQbaixc.js                                        6.33 kB │ gzip:   2.74 kB │ map:     20.81 kB
21:19:20 [vite] dist/_astro/LessonSidebar.LuiR1yxC.js                                           6.62 kB │ gzip:   2.51 kB │ map:     11.37 kB
21:19:20 [vite] dist/_astro/ProfileForm.D8xdD5a6.js                                             8.13 kB │ gzip:   3.16 kB │ map:     14.73 kB
21:19:20 [vite] dist/_astro/_baseUniq.B6POPuNi.js                                               8.90 kB │ gzip:   3.77 kB │ map:     79.11 kB
21:19:20 [vite] dist/_astro/MissionLogGrid.DZMOjq6m.js                                          9.32 kB │ gzip:   4.35 kB │ map:     16.84 kB
21:19:20 [vite] dist/_astro/graph.BU_A7aoE.js                                                   9.79 kB │ gzip:   3.43 kB │ map:     70.48 kB
21:19:20 [vite] dist/_astro/stateDiagram-FHFEXIEX.SsDr65pY.js                                  10.88 kB │ gzip:   3.90 kB │ map:     35.89 kB
21:19:20 [vite] dist/_astro/dagre-KV5264BT.BC_ucu1d.js                                         11.46 kB │ gzip:   4.35 kB │ map:     45.06 kB
21:19:20 [vite] dist/_astro/diagram-G4DWMVQ6.CQiIlX8T.js                                       16.33 kB │ gzip:   5.93 kB │ map:     60.85 kB
21:19:20 [vite] dist/_astro/ishikawaDiagram-UXIWVN3A.DXgSpcZn.js                               17.93 kB │ gzip:   6.89 kB │ map:     63.26 kB
21:19:20 [vite] dist/_astro/template.CludeJ1b.js                                               19.54 kB │ gzip:   7.91 kB │ map:    180.64 kB
21:19:20 [vite] dist/_astro/kanban-definition-6JOO6SKY.C12ut8S4.js                             20.75 kB │ gzip:   7.45 kB │ map:     68.27 kB
21:19:20 [vite] dist/_astro/sankeyDiagram-XADWPNL6.CXn8vl21.js                                 22.58 kB │ gzip:   8.36 kB │ map:     85.12 kB
21:19:20 [vite] dist/_astro/mindmap-definition-QFDTVHPH.XmOzx1KI.js                            23.91 kB │ gzip:   8.16 kB │ map:     77.51 kB
21:19:20 [vite] dist/_astro/journeyDiagram-VCZTEJTY.CUky9FAe.js                                24.05 kB │ gzip:   8.60 kB │ map:     80.69 kB
21:19:20 [vite] dist/_astro/PreworkPathQuiz.1FIjTaEo.js                                        24.60 kB │ gzip:   9.26 kB │ map:     47.20 kB
21:19:20 [vite] dist/_astro/wardleyDiagram-NUSXRM2D.CxfVFRmS.js                                24.74 kB │ gzip:   6.83 kB │ map:     79.20 kB
21:19:20 [vite] dist/_astro/ContentTopBar.DKDDVYyf.js                                          25.27 kB │ gzip:   8.07 kB │ map:     56.43 kB
21:19:20 [vite] dist/_astro/erDiagram-SMLLAGMA.iDPl6lBS.js                                     27.31 kB │ gzip:   9.58 kB │ map:     90.47 kB
21:19:20 [vite] dist/_astro/layout.BbOg9nJD.js                                                 29.71 kB │ gzip:  10.76 kB │ map:    184.62 kB
21:19:20 [vite] dist/_astro/gitGraphDiagram-UUTBAWPF.BHto7GzA.js                               29.94 kB │ gzip:   8.98 kB │ map:    119.31 kB
21:19:20 [vite] dist/_astro/timeline-definition-GMOUNBTQ.DPWDVZg1.js                           31.31 kB │ gzip:  10.40 kB │ map:    108.04 kB
21:19:20 [vite] dist/_astro/requirementDiagram-MS252O5E.svPWWmcN.js                            31.46 kB │ gzip:   9.98 kB │ map:     99.12 kB
21:19:20 [vite] dist/_astro/MapEditor.CtjeIYz3.js                                              32.65 kB │ gzip:  10.95 kB │ map:     85.78 kB
21:19:20 [vite] dist/_astro/quadrantDiagram-34T5L4WZ.a0_bCB2h.js                               34.30 kB │ gzip:  10.18 kB │ map:    110.56 kB
21:19:20 [vite] dist/_astro/chunk-OYMX7WX6.Dhs63wD2.js                                         37.40 kB │ gzip:  12.23 kB │ map:    123.18 kB
21:19:20 [vite] dist/_astro/index.rKR2BP5r.js                                                  37.98 kB │ gzip:  15.22 kB │ map:    184.16 kB
21:19:20 [vite] dist/_astro/xychartDiagram-5P7HB3ND.-4SGfYFi.js                                40.83 kB │ gzip:  11.70 kB │ map:    134.29 kB
21:19:20 [vite] dist/_astro/vennDiagram-DHZGUBPP.BjF4i4TQ.js                                   41.89 kB │ gzip:  15.72 kB │ map:    186.34 kB
21:19:20 [vite] dist/_astro/chunk-4TB4RGXK.Dr6u6brH.js                                         47.64 kB │ gzip:  15.32 kB │ map:    145.83 kB
21:19:20 [vite] dist/_astro/flowDiagram-DWJPFMVM.71XpgQon.js                                   60.95 kB │ gzip:  19.59 kB │ map:    189.95 kB
21:19:20 [vite] dist/_astro/ganttDiagram-T4ZO3ILL.DMYNlQhU.js                                  69.85 kB │ gzip:  23.63 kB │ map:    247.76 kB
21:19:20 [vite] dist/_astro/c4Diagram-AHTNJAMY.Du_VZQJ4.js                                     70.40 kB │ gzip:  19.86 kB │ map:    203.82 kB
21:19:20 [vite] dist/_astro/blockDiagram-DXYQGD6D.CzltpfH8.js                                  71.39 kB │ gzip:  20.49 kB │ map:    246.45 kB
21:19:20 [vite] dist/_astro/cose-bilkent-S5V4N54A.C6YYd9I9.js                                  82.07 kB │ gzip:  22.74 kB │ map:    305.43 kB
21:19:20 [vite] dist/_astro/sequenceDiagram-FGHM5R23.CLWhP551.js                              117.09 kB │ gzip:  31.18 kB │ map:    350.74 kB
21:19:20 [vite] dist/_astro/page.C9jFDwVx.js                                                  145.34 kB │ gzip:  49.66 kB │ map:    984.47 kB
21:19:20 [vite] dist/_astro/architectureDiagram-Q4EWVU46.BL3Pf1ZB.js                          149.66 kB │ gzip:  42.40 kB │ map:    593.55 kB
21:19:20 [vite] dist/_astro/katex.BaVNkuZ_.js                                                 259.47 kB │ gzip:  77.20 kB │ map:    970.11 kB
21:19:20 [vite] dist/_astro/cytoscape.esm.3X4efrt8.js                                         442.86 kB │ gzip: 142.11 kB │ map:  1,865.63 kB
21:19:20 [vite] dist/_astro/wardley-RL74JXVD.B2J7Jyh5.js                                      492.90 kB │ gzip: 110.12 kB │ map:  1,826.71 kB
21:19:20 [vite] dist/_astro/mermaid.core.Do_3BQPW.js                                          600.29 kB │ gzip: 145.58 kB │ map:  1,938.53 kB
21:19:20 [vite] dist/_astro/index.CkL1OoYS.js                                                 969.64 kB │ gzip: 312.14 kB │ map:  2,113.58 kB
21:19:20 [vite] dist/_astro/PhaserGame.BfOmk95n.js                                          1,688.10 kB │ gzip: 400.06 kB │ map: 10,850.21 kB
21:19:20 [WARN] [vite] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
[sentry-vite-plugin] Error: An error occurred. Couldn't finish all operations: Error: Command failed: /home/runner/work/przeprogramowani-sites/przeprogramowani-sites/node_modules/@sentry/cli-linux-x64/bin/sentry-cli --header sentry-trace:5c3c3cf4fb2f49f3b7e72dd4a5fe97e9-87321786e4a17591 releases new 5755bd842af6d2ab606efedfa3919e745af86689
error: Project not found. Ensure that you configured the correct project and organization.
Add --log-level=[info|debug] or export SENTRY_LOG_LEVEL=[info|debug] to see more output.
Please attach the full debug log to all bug reports.
    at genericNodeError (node:internal/errors:983:15)
    at wrappedFn (node:internal/errors:537:14)
    at ChildProcess.exithandler (node:child_process:417:12)
    at ChildProcess.emit (node:events:519:28)
    at ChildProcess.emit (node:domain:489:12)
    at maybeClose (node:internal/child_process:1101:16)
    at ChildProcess._handle.onexit (node:internal/child_process:304:5) {
  code: 1,
  killed: false,
  signal: null,
  cmd: '/home/runner/work/przeprogramowani-sites/przeprogramowani-sites/node_modules/@sentry/cli-linux-x64/bin/sentry-cli --header sentry-trace:5c3c3cf4fb2f49f3b7e72dd4a5fe97e9-87321786e4a17591 releases new 5755bd842af6d2ab606efedfa3919e745af86689'
}
> Found 490 files
> Analyzing 490 sources
> Analyzing completed in 0.05s
> Adding source map references
> Bundling completed in 1.929s
> Bundled 490 files for upload
> Bundle ID: 42a82f64-e585-5994-bc33-e32ce44c854f
> Optimizing completed in 0.039s
error: API request failed
Caused by:
    sentry reported an error: One or more projects are invalid (http status: 400)
Add --log-level=[info|debug] or export SENTRY_LOG_LEVEL=[info|debug] to see more output.
Please attach the full debug log to all bug reports.
[sentry-vite-plugin] Error: An error occurred. Couldn't finish all operations: Error: Command --header sentry-trace:99e932bdf627413ba22407f2075c3605-b9df154a927836a6-1 --header baggage:sentry-environment=production,sentry-release=5.2.1,sentry-public_key=4c2bae7d9fbc413e8f7385f55c515d51,sentry-trace_id=99e932bdf627413ba22407f2075c3605,sentry-sample_rate=1,sentry-transaction=Sentry%20Bundler%20Plugin%20execution,sentry-sampled=true sourcemaps upload -p javascript-astro --release 5755bd842af6d2ab606efedfa3919e745af86689 /tmp/sentry-bundler-plugin-upload-g5psuk --ignore node_modules --no-rewrite failed with exit code 1
    at ChildProcess.<anonymous> (/home/runner/work/przeprogramowani-sites/przeprogramowani-sites/node_modules/@sentry/cli/js/helper.js:321:32)
    at ChildProcess.emit (node:events:519:28)
    at ChildProcess.emit (node:domain:489:12)
    at ChildProcess._handle.onexit (node:internal/child_process:293:12)
21:19:24 [vite] ✓ built in 41.72s
 prerendering static routes 
21:19:24 ✓ Completed in 12ms.

21:19:24 [build] Rearranging server assets...
21:19:24 [build] Server built in 69.75s
21:19:24 [build] Complete!
> edu-platform@0.0.1 check:build-content
> node scripts/verify-build-content.mjs
[verify-build-content] scanning dist/_worker.js/chunks/*.mjs
  OK    lessons10xDevs3              source=  5  bundled=  5
  FAIL  lessons10xDevs3Prework       source= 15  bundled=  0
  FAIL  lessons10xDevs3PreworkEn     source= 15  bundled=  0
[verify-build-content] FAILED — bundled count does not match source for:
  - lessons10xDevs3Prework (src/content/lessons10xDevs3Prework/pl): expected 15, found 0
  - lessons10xDevs3PreworkEn (src/content/lessons10xDevs3Prework/en): expected 15, found 0
Likely causes: collection silently dropped during build, source files moved/renamed, or the `course-key` meta tag changed.
npm error Lifecycle script `check:build-content` failed with error:
npm error code 1
npm error path /home/runner/work/przeprogramowani-sites/przeprogramowani-sites/projects/edu-platform
npm error workspace edu-platform@0.0.1
npm error location /home/runner/work/przeprogramowani-sites/przeprogramowani-sites/projects/edu-platform
npm error command failed
npm error command sh -c node scripts/verify-build-content.mjs
npm error Lifecycle script `build` failed with error:
npm error code 1
npm error path /home/runner/work/przeprogramowani-sites/przeprogramowani-sites/projects/edu-platform
npm error workspace edu-platform@0.0.1
npm error location /home/runner/work/przeprogramowani-sites/przeprogramowani-sites/projects/edu-platform
npm error command failed
npm error command sh -c npm run check:lesson-html && rm -f .astro/data-store.json node_modules/.astro/data-store.json && astro build && npm run check:build-content



 NX   Running target build for project edu-platform and 2 tasks it depends on failed

Failed tasks:

- edu-platform:build

Hint: run the command with --verbose for more details.

Error: Process completed with exit code 1.