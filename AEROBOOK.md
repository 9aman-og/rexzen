# Aerobook and connected Aero

Aerobook opens at `/aerobook/` without an account. It supports finger, pen and mouse writing, straight lines, an eraser, undo and redo, page navigation, paper colours, grids, lines, dots, plain paper, and zoom/pan. It saves editable strokes in IndexedDB. Export a page as PNG, every page as a PDF, or the editable `.aerobook` notebook.

Aero opens at `/aero/`. Google sign-in returns to `https://rexzen.si/auth/callback`; the consumer ChatGPT account is not used for authentication. Notes, tasks, goals, projects, journal entries, relationships, saved conversations and notebooks share the same navigation. A notebook's Save button saves it in Aero when signed in. Device auto-save remains available offline.

An Aerobook page can be attached to a question in Aero. The user sees the question, selected sources, image, destination provider and request hash before sending. Model responses cannot apply a plan: accepting the plan is a separate action. Sources and revisions are checked before dispatch. Reusing a completed receipt replays its saved answer.

ChatGPT export uses the mobile share sheet where supported, or copies/downloads the page for the user to paste or attach in ChatGPT. It does not scrape a consumer session or silently send a message.

## Hosting and storage

The existing GitHub Pages workflow still builds and validates the ten public Rexzen pages from the pinned source archive. The reviewed `aero-apps-source.zip.b64` is a base64-encoded ZIP containing the app, backend, scripts and tests; the workflow verifies its pinned SHA-256 before extracting it. `scripts/build-apps.py` overlays the new app routes and versioned assets, then replaces public Aero entry links with the same-domain app URL.

The backend is the separately deployed Supabase Edge Function `rexzen-aero`. `backend/schema.sql` creates only its private `rexzen_aero` schema. Browser roles have no schema/table privileges. The function verifies each access token with Supabase Auth and scopes every query to the verified user ID. Record, conversation, key, receipt and notebook payloads use managed encryption with a key in Supabase Vault. This is service-managed encryption, not end-to-end encryption.

Personal OpenAI or Groq API keys are encrypted in backend storage and never returned or included in exports. An existing Groq owner connection is available only to the explicit Vault allowlist; it is not shared with arbitrary signed-in users. Requests use the connected provider's quota and billing settings.

The legacy Aero service and its data are unchanged. Settings links to the previous workspace so users can export and explicitly import older records. Existing Lyfe and Connect tables/functions are unchanged.

## Development

Decode `aero-apps-source.zip.b64` with `python3 -m base64 -d aero-apps-source.zip.b64 > aero-apps-source.zip`, then extract the ZIP in the repository root. Use Node 22+ and Python 3. `npm test` checks the backend boundary and stale editor/draft handling. `npm run build` recreates the public export and app overlay in `_root_site/`. Building the backend requires the pinned `esbuild` dev dependency; `npm run build:backend` emits the single-file dashboard deployment at `backend/deploy/index.ts`.

Deploy `backend/schema.sql` once using the project SQL editor, then deploy `backend/deploy/index.ts` as `rexzen-aero`. The function uses the project's standard `SUPABASE_URL`, `SUPABASE_ANON_KEY` and `SUPABASE_DB_URL` environment. Its own fresh-user verification supports the current JWT signing system; the optional legacy-secret JWT gateway check is disabled. Frontend configuration contains only the intentionally public project URL and publishable key.
