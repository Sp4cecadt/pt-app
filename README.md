# PT Coach: personal trainer web app (PWA)

Home Screen web app for iPhone (no Apple developer account needed). Hosted on GitHub Pages.

- `index.html`, `app.css`, `app.js`: UI and router (Home, Library, Log, Log detail, Post-workout, Progress)
- `js/data.js`: seeded demo data (today's workout, video library, clients)
- `js/db.js`: IndexedDB for uploaded videos and form clips (on-device)
- `js/backend.js`: stubs showing where Supabase (data, notifications) and Cloudflare Stream (video) plug in
- `sw.js`: offline cache (bump `V` on every deploy); `manifest.json`, `icons/`: install + Home Screen icon
- `img/`, `vid/`: demo thumbnails and short demo form-video loops
- `build/`: local server, e2e tests (Playwright), deploy script (not published)

Install on iPhone: open the URL in Safari → Share → Add to Home Screen.
