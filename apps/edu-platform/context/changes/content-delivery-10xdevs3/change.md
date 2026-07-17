---
change_id: content-delivery-10xdevs3
title: Fix 10xDevs3 content delivery pipeline (text tags, prework links, mermaid diagrams)
status: implemented
created: 2026-05-16
updated: 2026-05-16
archived_at: null
---

## Notes

I'm working on content delivery for "10xDevs3" course from @workbench where work on progress to our platform (this project) and circle sync (via @../../utils/circle-lesson-backup/). @workbench/lessons/ is source of truth, it gets transported via "transport" script to  @src/content-source/10xDevs3/pl which  is staging for polish content, it gets transformed to html from this folder with generate:lesson-html script to @content10xDevs3/pl from which its used by the platform and should be synced to Circle. We have following issues with the pipeline:
- `<text>` is not displayed properly by Circle, we should strip `` or replace them with ** ** or _ _ when generating lesson html
- we're missing links to prework lesson @src/content/lessons10xDevs3Prework/ which are mentioned but not linked 
- we're not displaying mermeid diagrams properly, we should ensure that we have proper <img src="link to diagram on cloudfront s3"> instead of diagrams in lesson body
