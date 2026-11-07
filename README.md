# Rexzen

AI tools for your notes and ideas. Research into how models learn from change.

- [Website](https://rexzen.si/)
- [People associated with us](https://rexzen.si/people/)
- [Aero private workspace](https://rexzen.si/aero/)
- [Aerobook notebook](https://rexzen.si/aerobook/)

The public website is published at rexzen.si through GitHub Pages, with HTTPS. Earlier /2/ page addresses redirect to the root pages. Aerobook and the connected Aero workspace now run on the same domain. Google sign-in and a separate authenticated Supabase backend support saved work. The previous Aero service remains available through Settings for explicit data export/import. See [the app documentation](AEROBOOK.md).

## Current website source

The checksum-pinned public-site baseline [source archive](rexzen-v2-source.tar.gz) contains 174 tracked files from source commit `7305177ad42a3cc868ffbff2a1c5b387eb26449e`.

Archive SHA-256: `83a1dabef4cb2b6c2ae77eb4793534f1147e150479b324973856be0f14b10d06`.

The [Pages workflow](.github/workflows/rexzen-pages.yml) checks the pinned baseline, reconstructs the reviewed app archive, applies the public presentation update and publishes the static site. The baseline has ten public pages; the current presentation has eleven, including the People directory. App checks and the Android preview build run before publication; a final check verifies the exact public release version. [Media and motion update notes](REXZEN-MEDIA.md) describe the real camera-shot media, Aero interface walkthrough, clearer copy and responsive layouts. [Earlier root-publication notes](REXZEN-V2.md) are retained as history.

The [connected app source manifest](aero-apps-source.manifest.json) is the authoritative current source set. It lists seven immutable base64 parts containing Aerobook, the Aero assistant, private Spaces, light/dark themes, the separately deployed backend, Android companion, tests and public presentation assets. Strip whitespace from each listed part, verify its declared length and SHA-256, concatenate in order, then decode the base64 ZIP. The workflow independently pins the exact decoded ZIP checksum and checks every part before extraction. Old unlisted parts and the monolithic `aero-apps-source.zip.b64` remain historical backups; do not substitute them for the manifest. See [AEROBOOK.md](AEROBOOK.md) and the reviewed archive’s `AERO-ASSISTANT.md` for storage and deployment details.

The [sitemap](https://rexzen.si/sitemap.xml) lists the eleven canonical pages. Search metadata supports discovery; it does not represent a Google creator badge or guarantee indexing or ranking.

## Repository boundary

This public repository contains sanitized website source and historical backups. Credentials, private account records, private context, unencrypted manuscripts and local research-run artifacts are excluded. Public manuscript downloads remain encrypted envelopes. Sonne Systems is maintained separately.

The repository root index.html, styles.css and favicon.svg are an earlier prototype. GitHub Pages builds the current website from the reviewed baseline and current source manifest.
