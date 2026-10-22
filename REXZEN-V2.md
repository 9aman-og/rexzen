# Rexzen refreshed website

Published at the root of rexzen.si on 22 October 2026 through GitHub Pages.

- [Website](https://rexzen.si/)
- [Aman Agarwal profile](https://rexzen.si/aman-agarwal/)
- [Sitemap](https://rexzen.si/sitemap.xml)
- [Aero workspace](https://rexzen.elven-wood-4902.chatgpt.site/aero)

The public website now uses rexzen.si directly. Its earlier `/2/` page addresses redirect to the matching root pages. The earlier production source and runtime are retained in the source archive and local source checkout. Aero remains on its existing service and database.

## Source integrity

- Archive: [rexzen-v2-source.tar.gz](rexzen-v2-source.tar.gz)
- Source commit: `e857d7a61b64654a7fb05376b6f082498429e736`
- Archive SHA-256: `2e889a11b0675154cc395eb48eccb06a344f49ee2f4f6395613c273a95d3a6ec`
- Archive size: 8,212,350 bytes
- Source files: 157, under `rexzen-site/`

The archive contains tracked website source, public media, encrypted public paper envelopes, and the original runtime. It excludes local account state, credentials, private context, unencrypted manuscripts, and research-run artifacts. Runtime secrets stay outside source control.

The archived source retains its separate `/2/` implementation and original hosting identity. The GitHub Pages workflow exports that reviewed design to the production root; it does not deploy or modify the archived private server. Extracting the archive and running its normal build still produces the original Worker package. The Pages workflow is the reproducible production export for this release.

## Public pages and motion

The site has ten canonical routes: home, projects, Aero overview, Rex, 2piarc, EOS, research, about, privacy, and Aman Agarwal's profile. Metadata, internal links, search results and transitions use the root paths. Assets belonging to the refreshed interface live under `/assets/site/`; shared public media and encrypted paper envelopes retain their separate folders.

Text reveals wait for page transitions and restore ordinary text after playing. Selected brand words use a shuffled opacity reveal. The original dark footer wordmark is restored with a blinking blue ring. Visible ambient videos loop without playback overlays; offscreen, background and reduced-motion behavior limit unnecessary work. Three background films use about 46% fewer bytes. Character rendering groups glyphs in one pass with a bounded cache. Phone hero heights and the recorded video panel are corrected.

The earlier source review covered all ten page openings at 320px and 1440px, with targeted 390px transition, footer, video, menu motion preference and profile-search checks. The root export was separately checked for all ten canonical pages, 763 internal references, 115 text-index references, generated metadata on every page and the Person/ProfilePage relationship. Rendered root-route checks cover the page transition, 2piarc character playback and Aman profile search. These checks do not constitute a new whole-site frame-rate benchmark.

The profile and other public pages include factual structured data and social sharing metadata. The sitemap lists only the ten canonical pages. Search indexing follows Google's own schedule; this release does not represent a Google creator badge or guaranteed search placement.

## Domain and application routing

GitHub Pages serves the public site at rexzen.si over HTTPS. Hostinger continues to manage DNS using the existing nameservers. The apex uses the four GitHub Pages IPv4 targets; www points to 9aman-og.github.io. Other verification records were retained.

The public `Open Aero` links and compatibility routes lead to `https://rexzen.elven-wood-4902.chatgpt.site/aero`. The private application and database remain there. No private workspace data, API keys or authentication service were migrated to GitHub Pages. The original `.openai/hosting.json` project ID, audience and bindings remain in the source archive.

Shared HTML page aliases and `/2/` page paths redirect to their corresponding root pages. Retired research resources remain absent; they were not restored during this publication.

## Maintaining the publication

[The publishing workflow](.github/workflows/rexzen-pages.yml) verifies the source archive checksum, applies the archive's reviewed metadata and public-text generators, rebases the public design to the production root, verifies references and schemas, and deploys the static output. Source updates require updating the archive and its expected checksum together. Public Google ownership verification files in the repository root are copied into the site when present.

The repository root HTML, CSS and earlier ZIP archives remain historical backups. The production site is generated from the checked source archive and workflow.
