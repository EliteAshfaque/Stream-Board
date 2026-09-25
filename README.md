# Stream Board

Live monitoring dashboard in React and TypeScript. The main feed is a local stream (same shape as a WebSocket / SSE). There is also a small GitHub panel that reads the public events API — no token required.

## Run

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal.

```bash
npm run build
```

The app has one route: `/`. Any other path shows the 404 page.

This project is Vinext (Cloudflare), not a standard Next.js Vercel app. Deploy with `npm run build`, then the host that supports the Vinext/Wrangler output. Opening a random path, or deploying it as a plain static site, will look like “page not found.”

## Layout

```text
src/app/             Route only: layout, page, 404, styles
src/components/      Screen and UI
src/hooks/           Stream, filters, GitHub query
src/services/        Stream + GitHub API
src/types/           Event model
src/utils/           Validation, metrics, helpers
src/providers/       Theme, language, query client
src/i18n/            English / French
src/config/          Limits and GitHub URL
```
