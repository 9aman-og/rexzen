# Rexzen

AI software and research.

## Current site

- Public website: https://rexzen.si
- Aero workspace: https://rexzen.si/aero
- Published release: v16
- Exact source: `1e73d9df5e87e9cc4dff60ef628b7deed063cebb`
- Complete source archive: `rexzen-aero-v16-source.zip`

## This release

A conversation-first Aero workspace with a charcoal navigation sidebar, selected-source chips, a searchable context inspector and visible relationships. Inspect records without selecting them. Question drafts, model choice and context selection survive view changes. Recent requests remain available from the sidebar.

Every AI dispatch retains its explicit request review. Expired reviews require a fresh review; requests never retry automatically. A delayed answer updates saved history without replacing a different conversation or a new draft. New answers retain the exact reviewed source excerpts inside encrypted conversation storage. Older answers without snapshots show that limitation explicitly. Each request uses the sources selected for that request; previous conversations are not automatically sent as context. Plan acceptance saves the complete reviewed plan.

Original character-opacity headline assembly settles back to ordinary text. It coordinates with the page sweep and respects reduced motion, focus, hidden pages and menu changes. The finite homepage scene, full-screen directory, 2piarc identity, scroll motion and eight-page sitemap remain in place.

## Repository boundaries

This is the private Rexzen backup repository. Sonne Systems is maintained separately. Archives exclude credentials, local context, personal workspace records and original PDF manuscripts. Public paper downloads use encrypted envelopes; passwords stay outside source control.

## Source archive

Download and extract `rexzen-aero-v16-source.zip` before building. It contains all 73 tracked source files from the exact published commit.

SHA-256: `d9b994a4c987155a397b29f9b89d4744ed7fe459bedd6139e1de51d2da149e18`

Archive size: 5285656 bytes.

The root HTML, CSS and favicon in this backup repository are an earlier prototype. The current source is inside the ZIP.

## Structure inside the archive

`public/` contains the pages, styles, scripts and original imagery. `server/` and `worker/` provide the application runtime. `drizzle/` contains database migrations. `scripts/build.mjs` packages the Worker and versioned public assets.

## Local build

```sh
npm ci
npm run build
```

Live provider credentials belong in server secrets and are scoped to the signed-in account. They must not be added to this repository or browser assets.
