# Rexzen second edition: prepared source backup

Prepared on 22 October 2026 for https://rexzen.si/2/.

**Status: built and reviewed locally; not yet published.** This GitHub backup does not deploy the website. The existing production site and its hosting identity are preserved. Publication requires access to the existing hosting project.

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

## What is prepared

The new edition has ten routes under `/2/`: the home page, projects, Aero overview, Rex, 2piarc, EOS, research, about, privacy, and Aman Agarwal's public profile. Internal links and canonical URLs remain in that namespace, and `/2/sitemap.xml` lists those routes. The private Aero application continues at `/aero`.

Text reveals wait for page transitions and restore ordinary text after playing. Selected brand words use a shuffled opacity reveal. The original dark footer wordmark is restored with a blinking blue ring. Visible ambient videos loop without playback overlays; offscreen, background, and reduced-motion behavior limit unnecessary work. Three background films use about 46% fewer bytes. Character rendering groups glyphs in one pass with a bounded cache. Phone hero heights and the recorded video panel are corrected.

All ten page openings were reviewed at 320px and 1440px, with targeted 390px transition, footer, video, menu motion preference, and profile search checks. Functional checks cover routing, retired resources, caching, video ranges, metadata, links, and preservation. The preserved baseline has 113 identical original asset objects and nine unchanged protected server files; the root router only gains a separate `/2` dispatch.

The profile and sitemap are prepared for search discovery. The new sitemap has not been submitted to Google because these URLs are not yet live. This source backup does not represent Google verification, a creator profile, or guaranteed indexing.

## Publication boundary

Use the original `.openai/hosting.json` project ID and production audience. Push this exact source through the Sites workflow before saving and deploying its matching build. Do not replace the production root, create another hosting project, or repoint the domain as part of this backup. GitHub Pages is not enabled for this repository.

The repository root HTML, CSS, and earlier ZIP archives are historical backups; this document identifies the prepared second edition separately.
