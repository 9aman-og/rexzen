# Rexzen

AI software and world-model research.

## Websites

- [Rexzen — the refreshed website](https://rexzen.si/)
- [Aman Agarwal's public profile](https://rexzen.si/aman-agarwal/)
- [Aero private workspace](https://rexzen.elven-wood-4902.chatgpt.site/aero)

The refreshed public website is published at the root of **rexzen.si** through GitHub Pages. The earlier `/2/` page addresses redirect to the corresponding root pages. HTTPS is enabled. Aero continues on its existing service and database; the public-site publication does not copy private workspace data into GitHub.

## Source and publishing

[Release notes](REXZEN-V2.md) describe the source, motion refinements, root-domain routing and validation. The [source archive](rexzen-v2-source.tar.gz) contains 157 tracked website files from source commit `e857d7a61b64654a7fb05376b6f082498429e736`.

Archive SHA-256: `2e889a11b0675154cc395eb48eccb06a344f49ee2f4f6395613c273a95d3a6ec`.

[The Pages workflow](.github/workflows/rexzen-pages.yml) verifies the archive, runs its reviewed metadata and public-text generators, prepares ten public routes for rexzen.si, checks links and profile schemas, and publishes the result. Shared HTML aliases and the earlier `/2/` page paths remain compatible. The private Aero application stays on its original backend.

[The sitemap](https://rexzen.si/sitemap.xml) lists the ten canonical public pages. Search metadata supports discovery; it does not represent a Google creator badge or guarantee indexing or ranking.

## Repository boundary

This public repository contains sanitized source backups and the publishing workflow. Credentials, account records, private context, unencrypted manuscripts, local research-run artifacts and private reel previews are excluded. Public paper downloads remain encrypted envelopes; their passwords stay outside source control. Sonne Systems is maintained separately.

## Historical backups

Earlier source ZIPs are retained, including `rexzen-motion-v18-source.zip`, `rexzen-aero-v16-source.zip`, `rexzen-aero-v15-source.zip`, `rexzen-aero-v13-source.zip`, and `rexzen-source-v10.zip`. The repository root `index.html`, `styles.css`, and `favicon.svg` are an earlier prototype. GitHub Pages builds the current website from the checked source archive rather than publishing that prototype.
