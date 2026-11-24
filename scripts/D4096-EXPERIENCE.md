# D4096 investor experience

The generated Pages route at `/research/bci/dense-4096/` is assembled from `public-research/dense-4096/`. `experience.html` becomes the public `index.html`; the earlier index, engineering PDF, CSV and research archive remain unchanged in the repository. `scripts/publish_dense_research.py` also adds discovery links to the research overview and the R0 landing page; no other page is rewritten by this overlay.

The cover and rim are concept geometry. The instanced electrode field and its Lambert inset use the published coordinates, not generated dots. Under fault injection the blue/amber colors visualize eligibility masks, not EEG. The model rejects below 4,000 usable total or 448 in a sector, or if the system clock/reference are missing. The regional floor is a provisional research choice, not a measured safety threshold. Each scenario is deterministic and calls the same gate in the browser and JSON generator.

```sh
node --test scripts/test-d4096-gate.mjs
node scripts/build-d4096-evidence.mjs
python scripts/test_publish_dense_experience.py
```

For browser verification, install Playwright in a separate development environment and set `D4096_URL` to the published route or your served staging overlay. `D4096_CHROMIUM` may point to an existing Chromium executable. Run `python scripts/test_d4096_browser.py`. Results with no WebGL must retain the static poster, numerical workbench, and links; no JavaScript retains the narrative and downloads. Generate `investor-brief.pdf` by printing `scripts/d4096-investor-brief.html` over a staging server with the site's font and brand paths and neighboring `d4096-render.webp`, backgrounds on, A4, no printer header/footer. The static poster is a clean raster of the 3D stage's electrode view; no separately invented geometry.

## Renderer provenance

Three.js `0.185.0`, unmodified upstream `three.module.min.js` and `three.core.min.js` from the [npm release tarball](https://registry.npmjs.org/three/-/three-0.185.0.tgz), integrity `sha512-+yRrcRO2iZa8uzvNNl0d7cL4huhgKgBvVJ0njcTe8xFqZ6DMAFZdCKDP91SEAuj25bNAj7k1QQdf+srZywVK6w==`. MIT license shipped as `THREE-LICENSE.txt`. No client-side CDN dependency or copied reference-site imagery. Rexzen's wordmark and Inter are served from the main site's asset directories.
