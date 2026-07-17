npm run build

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
23:20:27 [WARN] [@sentry/astro] You passed in additional options (dsn) to the Sentry integration. This is deprecated and will stop working in a future version. Instead, configure the Sentry SDK in your `sentry.client.config.(js|ts)` or `sentry.server.config.(js|ts)` files.
23:20:27 [vite] Forced re-optimization of dependencies
23:20:27 [content] Syncing content
23:20:28 [content] Synced content
23:20:28 [types] Generated 574ms
23:20:28 [build] output: "server"
23:20:28 [build] directory: /Users/psmyrdek/dev/przeprogramowani-sites/projects/edu-platform/dist/
23:20:28 [build] adapter: @astrojs/cloudflare
23:20:28 [build] Collecting build info...
23:20:28 [build] ✓ Completed in 602ms.
23:20:28 [build] Building server entrypoints...
23:20:33 [vite] ✓ built in 5.28s
23:20:33 [build] ✓ Completed in 5.30s.

 building client (vite) 
23:20:39 [vite] ✓ 2651 modules transformed.
23:20:39 [vite] dist/_astro/index.BGP_IR6B.css                                                  0.20 kB │ gzip:   0.15 kB
23:20:39 [vite] dist/_astro/index.IN1601bJ.css                                                  0.75 kB │ gzip:   0.23 kB
23:20:39 [vite] dist/_astro/PhaserGame.CC7Apvnd.css                                             7.23 kB │ gzip:   1.86 kB
23:20:39 [vite] dist/_astro/clone._duJfJXy.js                                                   0.09 kB │ gzip:   0.11 kB
23:20:39 [vite] dist/_astro/channel.00lNsMxf.js                                                 0.11 kB │ gzip:   0.13 kB
23:20:39 [vite] dist/_astro/init.Gi6I4Gst.js                                                    0.15 kB │ gzip:   0.13 kB
23:20:39 [vite] dist/_astro/CourseLayout.astro_astro_type_script_index_0_lang.BfvkYkcx.js       0.16 kB │ gzip:   0.16 kB
23:20:39 [vite] dist/_astro/chunk-QZHKN3VN.I49U976y.js                                          0.20 kB │ gzip:   0.16 kB
23:20:39 [vite] dist/_astro/chunk-4BX2VUAB.CUAFK9D3.js                                          0.23 kB │ gzip:   0.17 kB
23:20:39 [vite] dist/_astro/chunk-55IACEB6.jVSwLrV1.js                                          0.24 kB │ gzip:   0.21 kB
23:20:39 [vite] dist/_astro/SidebarToggle.DOeuXk3z.js                                           0.31 kB │ gzip:   0.22 kB
23:20:39 [vite] dist/_astro/this.C2dEzbLp.js                                                    0.32 kB │ gzip:   0.23 kB
23:20:39 [vite] dist/_astro/useCaptcha.svelte.CQl3EDg9.js                                       0.35 kB │ gzip:   0.26 kB
23:20:39 [vite] dist/_astro/chunk-FMBD7UC4.D7mc7Cy7.js                                          0.37 kB │ gzip:   0.27 kB
23:20:39 [vite] dist/_astro/stateDiagram-v2-QKLJ7IA2.CKwS32F1.js                                0.44 kB │ gzip:   0.31 kB
23:20:39 [vite] dist/_astro/LessonSidebar.M30Ab_Ca.js                                           0.46 kB │ gzip:   0.29 kB
23:20:39 [vite] dist/_astro/ContentTopBar.BRQ_ofHz.js                                           0.47 kB │ gzip:   0.29 kB
23:20:39 [vite] dist/_astro/style.FWQyUpVf.js                                                   0.48 kB │ gzip:   0.32 kB
23:20:39 [vite] dist/_astro/chunk-EDXVE4YY.tvMjFn3s.js                                          0.51 kB │ gzip:   0.36 kB
23:20:39 [vite] dist/_astro/classDiagram-6PBFFD2Q.CRXkramz.js                                   0.52 kB │ gzip:   0.34 kB
23:20:39 [vite] dist/_astro/classDiagram-v2-HSJHXN6E.CRXkramz.js                                0.52 kB │ gzip:   0.34 kB
23:20:39 [vite] dist/_astro/min.JPCRphIn.js                                                     0.59 kB │ gzip:   0.37 kB
23:20:39 [vite] dist/_astro/_commonjsHelpers.gnU0ypJ3.js                                        0.61 kB │ gzip:   0.33 kB
23:20:39 [vite] dist/_astro/infoDiagram-42DDH7IO.DZlv42CH.js                                    0.69 kB │ gzip:   0.46 kB
23:20:39 [vite] dist/_astro/index-client.llW0PSDU.js                                            0.70 kB │ gzip:   0.43 kB
23:20:39 [vite] dist/_astro/input.0xUcG_dP.js                                                   0.79 kB │ gzip:   0.42 kB
23:20:39 [vite] dist/_astro/preload-helper.BlTxHScW.js                                          1.11 kB │ gzip:   0.65 kB
23:20:39 [vite] dist/_astro/client.svelte.C0tkbH4_.js                                           1.13 kB │ gzip:   0.63 kB
23:20:39 [vite] dist/_astro/ordinal.BYWQX77i.js                                                 1.19 kB │ gzip:   0.57 kB
23:20:39 [vite] dist/_astro/LessonNavigationLabel.sVxO3lq_.js                                   1.35 kB │ gzip:   0.76 kB
23:20:39 [vite] dist/_astro/externalLessonShellCopy.CS4Qrrnh.js                                 1.43 kB │ gzip:   0.67 kB
23:20:39 [vite] dist/_astro/SidebarToggle.BxcDGftc.js                                           1.62 kB │ gzip:   0.97 kB
23:20:39 [vite] dist/_astro/render.BOmXxxYn.js                                                  1.65 kB │ gzip:   0.94 kB
23:20:39 [vite] dist/_astro/constants.NvibHpRl.js                                               1.78 kB │ gzip:   1.10 kB
23:20:39 [vite] dist/_astro/attributes.CovzjKsy.js                                              1.79 kB │ gzip:   1.00 kB
23:20:39 [vite] dist/_astro/chunk-YZCP3GAM.CscZXRH3.js                                          1.88 kB │ gzip:   0.83 kB
23:20:39 [vite] dist/_astro/class.eYf_ZiyN.js                                                   2.04 kB │ gzip:   1.06 kB
23:20:39 [vite] dist/_astro/NewMapModal.B0jL4ttA.js                                             2.05 kB │ gzip:   0.95 kB
23:20:39 [vite] dist/_astro/diagram-5BDNPKRD.CtbFe931.js                                        2.86 kB │ gzip:   1.42 kB
23:20:39 [vite] dist/_astro/LessonProgressToggle.DERdmojp.js                                    3.12 kB │ gzip:   1.53 kB
23:20:39 [vite] dist/_astro/each.679GOR08.js                                                    3.12 kB │ gzip:   1.59 kB
23:20:39 [vite] dist/_astro/props.DGThznAu.js                                                   3.16 kB │ gzip:   1.60 kB
23:20:39 [vite] dist/_astro/arc.zb0mhaw-.js                                                     3.43 kB │ gzip:   1.47 kB
23:20:39 [vite] dist/_astro/LayoutScripts.astro_astro_type_script_index_0_lang.sBHC3xMg.js      4.12 kB │ gzip:   1.66 kB
23:20:39 [vite] dist/_astro/diagram-TYMM5635.D5Uzh_0D.js                                        4.32 kB │ gzip:   1.89 kB
23:20:39 [vite] dist/_astro/defaultLocale.DX6XiGOO.js                                           4.69 kB │ gzip:   2.18 kB
23:20:39 [vite] dist/_astro/ExternalLogin.BL6QUsQk.js                                           4.75 kB │ gzip:   2.28 kB
23:20:39 [vite] dist/_astro/Login.DOiXqjMe.js                                                   5.20 kB │ gzip:   2.51 kB
23:20:39 [vite] dist/_astro/pieDiagram-DEJITSTG.BFfwd56z.js                                     5.38 kB │ gzip:   2.40 kB
23:20:39 [vite] dist/_astro/linear.Dq1z0kBu.js                                                  5.66 kB │ gzip:   2.31 kB
23:20:39 [vite] dist/_astro/SignupForm.C2CKo7M2.js                                              5.89 kB │ gzip:   2.82 kB
23:20:39 [vite] dist/_astro/diagram-MMDJMWI5.DA8U1Jsh.js                                        5.92 kB │ gzip:   2.52 kB
23:20:39 [vite] dist/_astro/LessonSidebar.BhW7HXvT.js                                           6.20 kB │ gzip:   2.29 kB
23:20:39 [vite] dist/_astro/ProfileForm.DJN0cjyx.js                                             7.71 kB │ gzip:   2.94 kB
23:20:39 [vite] dist/_astro/_baseUniq.DkC_wRSQ.js                                               8.48 kB │ gzip:   3.53 kB
23:20:39 [vite] dist/_astro/MissionLogGrid.Bv3MNN02.js                                          8.90 kB │ gzip:   4.13 kB
23:20:39 [vite] dist/_astro/graph.AdGzeQKz.js                                                   9.37 kB │ gzip:   3.21 kB
23:20:39 [vite] dist/_astro/stateDiagram-FHFEXIEX.BYwT_CX5.js                                  10.47 kB │ gzip:   3.68 kB
23:20:39 [vite] dist/_astro/dagre-KV5264BT.CsgMTwbA.js                                         11.04 kB │ gzip:   4.12 kB
23:20:39 [vite] dist/_astro/diagram-G4DWMVQ6.DXnbyyP_.js                                       15.92 kB │ gzip:   5.72 kB
23:20:39 [vite] dist/_astro/ishikawaDiagram-UXIWVN3A.Y8lBdMUj.js                               17.51 kB │ gzip:   6.68 kB
23:20:39 [vite] dist/_astro/template.Dqso9S_H.js                                               19.12 kB │ gzip:   7.69 kB
23:20:39 [vite] dist/_astro/kanban-definition-6JOO6SKY.CIbQXtZY.js                             20.34 kB │ gzip:   7.24 kB
23:20:39 [vite] dist/_astro/sankeyDiagram-XADWPNL6.Cq4_WKXd.js                                 22.16 kB │ gzip:   8.15 kB
23:20:39 [vite] dist/_astro/mindmap-definition-QFDTVHPH.BzumOjvF.js                            23.49 kB │ gzip:   7.95 kB
23:20:39 [vite] dist/_astro/journeyDiagram-VCZTEJTY.Cjwp60Xw.js                                23.63 kB │ gzip:   8.38 kB
23:20:39 [vite] dist/_astro/PreworkPathQuiz.BOG5CgoR.js                                        24.19 kB │ gzip:   9.03 kB
23:20:39 [vite] dist/_astro/wardleyDiagram-NUSXRM2D.CyQKWtK6.js                                24.32 kB │ gzip:   6.61 kB
23:20:39 [vite] dist/_astro/ContentTopBar.US1ave6B.js                                          24.85 kB │ gzip:   7.85 kB
23:20:39 [vite] dist/_astro/erDiagram-SMLLAGMA.CRp2-YyD.js                                     26.90 kB │ gzip:   9.37 kB
23:20:39 [vite] dist/_astro/layout.MKZJbW58.js                                                 29.29 kB │ gzip:  10.52 kB
23:20:39 [vite] dist/_astro/gitGraphDiagram-UUTBAWPF.B1VkvP_W.js                               29.52 kB │ gzip:   8.76 kB
23:20:39 [vite] dist/_astro/timeline-definition-GMOUNBTQ.DagCAVyK.js                           30.89 kB │ gzip:  10.19 kB
23:20:39 [vite] dist/_astro/requirementDiagram-MS252O5E.B7nnnFME.js                            31.04 kB │ gzip:   9.77 kB
23:20:39 [vite] dist/_astro/MapEditor.DkMMgcCz.js                                              32.24 kB │ gzip:  10.73 kB
23:20:39 [vite] dist/_astro/quadrantDiagram-34T5L4WZ.-bLRc-Hu.js                               33.88 kB │ gzip:   9.97 kB
23:20:39 [vite] dist/_astro/chunk-OYMX7WX6.CFrBH1jl.js                                         36.98 kB │ gzip:  12.01 kB
23:20:39 [vite] dist/_astro/index.BOeqtr82.js                                                  37.57 kB │ gzip:  15.03 kB
23:20:39 [vite] dist/_astro/xychartDiagram-5P7HB3ND.CeFqKt_g.js                                40.41 kB │ gzip:  11.49 kB
23:20:39 [vite] dist/_astro/vennDiagram-DHZGUBPP.COwbawa9.js                                   41.47 kB │ gzip:  15.50 kB
23:20:39 [vite] dist/_astro/chunk-4TB4RGXK.C1Z1MFHM.js                                         47.23 kB │ gzip:  15.11 kB
23:20:39 [vite] dist/_astro/flowDiagram-DWJPFMVM.CLdB2_MH.js                                   60.54 kB │ gzip:  19.38 kB
23:20:39 [vite] dist/_astro/ganttDiagram-T4ZO3ILL.BeuALdxA.js                                  69.44 kB │ gzip:  23.43 kB
23:20:39 [vite] dist/_astro/c4Diagram-AHTNJAMY.BEzyOypt.js                                     69.98 kB │ gzip:  19.65 kB
23:20:39 [vite] dist/_astro/blockDiagram-DXYQGD6D.D-LE_Qrt.js                                  70.97 kB │ gzip:  20.28 kB
23:20:39 [vite] dist/_astro/cose-bilkent-S5V4N54A.UNCFrTBK.js                                  81.65 kB │ gzip:  22.50 kB
23:20:39 [vite] dist/_astro/sequenceDiagram-FGHM5R23.COGDREnU.js                              116.68 kB │ gzip:  30.97 kB
23:20:39 [vite] dist/_astro/page.BN7kPiWz.js                                                  144.92 kB │ gzip:  49.46 kB
23:20:39 [vite] dist/_astro/architectureDiagram-Q4EWVU46.Bcpu31kQ.js                          149.25 kB │ gzip:  42.17 kB
23:20:39 [vite] dist/_astro/katex.DHMw6HUq.js                                                 259.05 kB │ gzip:  76.99 kB
23:20:39 [vite] dist/_astro/cytoscape.esm.Bs-OJvs3.js                                         442.44 kB │ gzip: 141.93 kB
23:20:39 [vite] dist/_astro/wardley-RL74JXVD.DaX1Xk_b.js                                      492.48 kB │ gzip: 109.90 kB
23:20:39 [vite] dist/_astro/mermaid.core.B9SnDWVr.js                                          599.88 kB │ gzip: 145.39 kB
23:20:39 [vite] dist/_astro/index.GAd4gNYv.js                                                 969.23 kB │ gzip: 311.91 kB
23:20:39 [vite] dist/_astro/PhaserGame.C2HyRvK-.js                                          1,687.69 kB │ gzip: 399.83 kB
23:20:39 [WARN] [vite] 
(!) Some chunks are larger than 500 kB after minification. Consider:
- Using dynamic import() to code-split the application
- Use build.rollupOptions.output.manualChunks to improve chunking: https://rollupjs.org/configuration-options/#output-manualchunks
- Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
23:20:39 [vite] ✓ built in 6.58s

 prerendering static routes 
23:20:39 ✓ Completed in 10ms.

23:20:39 [build] Rearranging server assets...
23:20:39 [build] Server built in 12.54s
23:20:39 [build] Complete!

> edu-platform@0.0.1 check:build-content
> node scripts/verify-build-content.mjs

[verify-build-content] scanning dist/_worker.js/chunks/*.mjs
  OK    lessons10xDevs3              source=  5  bundled=  5
  OK    lessons10xDevs3Prework       source= 15  bundled= 15
  OK    lessons10xDevs3PreworkEn     source= 15  bundled= 15