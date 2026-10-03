# Rexzen

AI software and research.

## Current release

Public website: https://rexzen.si
Aero workspace: https://rexzen.si/aero
Published release: v18
Exact source: `43378cfce56f8c3930b4082a664c305bb4ce265c`
Complete source archive: `rexzen-motion-v18-source.zip`

## This release

Original material films for Rexzen and Aero, with a finite play cycle, Pause, Replay and seeking. The large identity entrance uses staggered letter opacity; a frosted three-pane transition carries public page changes. Initial browser layout stabilization preserves the entrance. Reduced motion, hidden pages, focus, menu actions, offscreen views and meaningful resizing stop active motion.

The directory previews crossfade decoded imagery. 2piarc combines an original material study with a manual interactive form study. The Aero workflow remains fictional and clearly labelled. LinkedIn and Instagram destinations are verified. Public pages have canonical URLs, page-specific share images, structured data and an eight-page sitemap. Search discovery is distinct from indexing.

Aero's request review, selected-source boundaries, encrypted per-account provider settings and proposal approval flow are retained from v16. This release does not add model-training claims.

## Repository boundary

This private repository contains a sanitized backup. Sonne Systems is maintained separately. Archives exclude credentials, local context, personal workspace records, source PDF manuscripts, local research-run artifacts and private reel previews. Public paper downloads use encrypted envelopes; passwords remain outside source control.

## Source archive

Extract `rexzen-motion-v18-source.zip` before building. It contains 94 entries from the exact published source commit. The root HTML/CSS/favicon in this repository are an earlier prototype; current source is inside the ZIP.

SHA-256: `fe2059e2cacecbbde4d443c240b88b67e9803a2710bb1aac4d0e2bc96dc268ca`
Archive size: 6084261 bytes.

`public/` contains the pages, styles, scripts and original media. `server/` and `worker/` contain the runtime. `drizzle/` contains migrations. `scripts/build.mjs` packages the Worker and versioned assets.

```sh
pnpm install --frozen-lockfile
pnpm run build
```

Live credentials belong in private server secrets scoped to the signed-in account.
