# Portfolio

Personal portfolio of Pasindu Promod: https://pasindu-promodh.github.io/portfolio2/

React + TypeScript + MUI, built with Vite and deployed to GitHub Pages by
`.github/workflows/deploy.yml` on every push to `main`.

## Development

```sh
cp .env.example .env   # fill in the Firebase web config
npm install
npm run dev            # analytics are disabled in dev builds
npm run lint && npm run build
```

Projects live in `src/data/projects.json`. Media in `public/` is referenced by a
relative path (e.g. `Screenshots/MBS/thumbnail.webp`); anything else is a full URL.

The build also writes a static HTML page per route (with its own title and
preview image), `404.html`, `sitemap.xml` and `robots.txt`; see `vite.config.js`.

## Analytics backend (Firebase project `portfolio-3431b`)

- `firestore.rules`: public visitors can only create their own visitor doc and
  logs; only the owner account can read or delete. Update the email there if
  the dashboard signs in with a different Google account.
- `firestore.indexes.json`: collection-group index used by the dashboard.
- `functions/`: emails on each new visitor, capped at 50 emails per day.

```sh
firebase functions:secrets:set GMAIL_EMAIL
firebase functions:secrets:set GMAIL_PASSWORD   # Gmail app password
firebase deploy --only firestore,functions
```

### App Check (recommended)

1. Create a reCAPTCHA v3 key for `pasindu-promodh.github.io`.
2. Register it under Firebase Console → App Check, and add it as the
   `VITE_RECAPTCHA_SITE_KEY` repository secret (and in `.env`).
3. After a deploy, once App Check metrics show verified requests, turn on
   enforcement for Cloud Firestore.
