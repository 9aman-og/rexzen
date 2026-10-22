# Rexzen

AI software and world-model research.

## Websites

- [New second edition](https://9aman-og.github.io/rexzen/2/)
- [Aman Agarwal's public profile](https://9aman-og.github.io/rexzen/2/aman-agarwal/)
- [Existing Rexzen website](https://rexzen.si/)
- [Aero workspace](https://rexzen.si/aero)

The second edition is published with GitHub Pages. The existing rexzen.si website remains unchanged. Mounting the new edition at rexzen.si/2/ still requires routing access to its existing host.

## Source and publishing

[Second-edition release notes](REXZEN-V2.md) describe the source, motion refinements, preservation checks and build process. The matching [source archive](rexzen-v2-source.tar.gz) contains 157 tracked website files from source commit `e857d7a61b64654a7fb05376b6f082498429e736`.

Archive SHA-256: `2e889a11b0675154cc395eb48eccb06a344f49ee2f4f6395613c273a95d3a6ec`.

[The Pages workflow](.github/workflows/rexzen-pages.yml) verifies the archive, prepares public pages for the repository's URL prefix, checks all ten routes and internal references, and publishes the static edition. The private Aero service continues on its original host.

[The second-edition sitemap](https://9aman-og.github.io/rexzen/2/sitemap.xml) lists the published pages. Search metadata supports discovery; it does not represent a Google creator badge or guarantee indexing.

## Repository boundary

This public repository contains sanitized source backups and the publishing workflow. Credentials, account records, private context, unencrypted manuscripts, local research-run artifacts and private reel previews are excluded. Public paper downloads remain encrypted envelopes; their passwords stay outside source control. Sonne Systems is maintained separately.

## Historical backups

Earlier source ZIPs are retained, including `rexzen-motion-v18-source.zip`, `rexzen-aero-v16-source.zip`, `rexzen-aero-v15-source.zip`, `rexzen-aero-v13-source.zip`, and `rexzen-source-v10.zip`. The root `index.html`, `styles.css`, and `favicon.svg` are an earlier prototype. GitHub Pages builds the second edition from the checked source archive rather than publishing that prototype.
