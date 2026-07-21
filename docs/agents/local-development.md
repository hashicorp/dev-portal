# Local development

This is a developer-only path. It is intentionally not advertised to content authors or
educators — they do not run this repo directly. (The repo's Docker image is the
content-repo preview flow, driven from the content / `web-unified-docs` side; its
`Dockerfile` entrypoint is `scripts/content-repo-preview/start.sh`, not a general way to
develop the frontend.)

Because `dev-portal` renders mostly by fetching content from the unified docs API (UDR),
running it locally is about pointing the frontend at a UDR backend:

1. The committed `.env` holds the API endpoints. `UNIFIED_DOCS_API` defaults to
   `http://localhost:8080` (a UDR instance running locally); a deployed UDR URL is also
   present commented-out. Edit `.env` to point at whichever backend you want.
1. Secret tokens go in `.env.local` (e.g. `MKTG_CONTENT_API_TOKEN`,
   `GITHUB_PUBLIC_REPO_TOKEN`) — see `.env.local.example`. Running `vercel link` then
   `vercel env pull .env.local` (per `README.md`) fetches these from the linked Vercel
   project, or ask a teammate for values.

Then install and run:

```sh
npm install
npm start
```

`npm start` runs `next dev --webpack` and serves the app on http://localhost:3000. To run
locally with accessibility checks, use `npm run start:with-axe` (sets `AXE_ENABLED`).
