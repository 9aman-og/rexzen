# Rexzen second edition

Published on GitHub Pages on 22 October 2026.

- [Website](https://9aman-og.github.io/rexzen/2/)
- [Aman Agarwal profile](https://9aman-og.github.io/rexzen/2/aman-agarwal/)
- [Sitemap](https://9aman-og.github.io/rexzen/2/sitemap.xml)

**Status: live on GitHub Pages.** The existing rexzen.si production site and its hosting identity are preserved. Mounting this edition at rexzen.si/2/ still requires routing access to the existing host.

## Source integrity

- Archive: [rexzen-v2-source.tar.gz](rexzen-v2-source.tar.gz)
- Source commit: `e857d7a61b64654a7fb05376b6f082498429e736`
- Archive SHA-256: `2e889a11b0675154cc395eb48eccb06a344f49ee2f4f6395613c273a95d3a6ec`
- Archive size: 8,212,350 bytes
- Source files: 157, under `rexzen-site/`

The archive contains tracked website source, public media, encrypted public paper envelopes, and the runtime. It excludes local account state, credentials, private context, unencrypted manuscripts, and research-run artifacts. Runtime secrets remain outside source control.

Extract the archive and build from the extracted `rexzen-site` directory:

```sh
tar -xzf rexzen-v2-source.tar.gz
cd rexzen-site
pnpm install --frozen-lockfile
pnpm run build
```

## What is published

The new edition has ten routes under `/2/`: the home page, projects, Aero overview, Rex, 2piarc, EOS, research, about, privacy, and Aman Agarwal's public profile. The archived source targets the `/2/` namespace on rexzen.si. The Pages workflow rebases public links, canonical URLs, media paths and transition routes to `/rexzen/2/` on 9aman-og.github.io and emits directory index pages. The private Aero application continues at https://rexzen.si/aero.

Text reveals wait for page transitions and restore ordinary text after playing. Selected brand words use a shuffled opacity reveal. The original dark footer wordmark is restored with a blinking blue ring. Visible ambient videos loop without playback overlays; offscreen, background, and reduced-motion behavior limit unnecessary work. Three background films use about 46% fewer bytes. Character rendering groups glyphs in one pass with a bounded cache. Phone hero heights and the recorded video panel are corrected.

All ten page openings were reviewed at 320px and 1440px, with targeted 390px transition, footer, video, menu motion preference, and profile search checks. Functional checks cover routing, retired resources, caching, video ranges, metadata, links, and preservation. The preserved baseline has 113 identical original asset objects and nine unchanged protected server files; the root router only gains a separate `/2` dispatch.

The public profile includes ProfilePage and Person metadata, and the sitemap lists the ten published routes. Search indexing follows Google’s own schedule. This release does not represent a Google creator badge or guaranteed search placement.

## Publishing and preservation

GitHub Pages is enabled with [the publishing workflow](.github/workflows/rexzen-pages.yml). It checks the source archive checksum, exports public content, verifies routes and internal references, and publishes the result. Source updates require updating the archive and its expected checksum together. Public Google ownership verification files in the repository root are copied into the site when present.

The original `.openai/hosting.json` project ID, audience and bindings remain in the archive. No deployment, domain change or DNS change was made to the existing rexzen.si host. The private Aero service remains there. A future publication at rexzen.si/2/ must retain that original hosting identity and use its normal source synchronization and deployment workflow.

The repository root HTML, CSS, and earlier ZIP archives are historical backups; this document identifies the prepared second edition separately.
