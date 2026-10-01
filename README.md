# Rexzen

AI software and research.

## Current site

- Public website: https://rexzen.si
- Aero workspace: https://rexzen.si/aero
- Published release: v15
- Exact source: `121ab4041edeef0b1c27c7124b31c847aa67eb20`
- Complete source archive: `rexzen-aero-v15-source.zip`

## This release

A full-screen, keyboard-accessible directory with editorial previews. Original finite homepage animation, page sweeps and bounded scroll motion. A rebuilt 2piarc page and identity. Aero walkthrough layout repaired. Canonical metadata, structured data, robots.txt and an eight-page sitemap.

## Repository boundaries

This is the private Rexzen backup repository. Sonne Systems is maintained separately. Source archives exclude credentials, local context, personal workspace records and original PDF manuscripts. Public paper downloads use encrypted envelopes; passwords stay outside source control.

## Source archive

Download and extract `rexzen-aero-v15-source.zip` before building. It contains all 71 tracked source files from the exact published commit. SHA-256: `b90e868c774652cdf91e50c27356bfd26d9e9d6991ef8f6dde1d46c342c5ac5a`. The root HTML, CSS and favicon in this backup repository are an earlier prototype. The current source is inside the ZIP.

## Structure inside the archive

`public/` contains the public pages, styles, scripts and original imagery. `server/` and `worker/` provide the application runtime. `drizzle/` contains database migrations. `scripts/build.mjs` packages the Worker and versioned public assets.

## Local build

```sh
npm ci
npm run build
```

Live provider credentials belong in server secrets and are scoped to the signed-in account. They must not be added to this repository or browser assets.
