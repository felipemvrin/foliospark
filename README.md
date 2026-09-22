# FolioSpark

FolioSpark is a premium portfolio and CV builder designed for creatives, developers, and product-minded professionals who want their work to feel alive, intentional, and editorial.

## Overview

This project is built as a modern React + TypeScript + Vite application with a data-first architecture so the public portfolio can be updated by editing structured content rather than rewriting components.

## Features

- Editorial, motion-led landing experience
- Data-driven portfolio structure for profile, projects, experience, education, and skills
- GitHub and Behance-ready content models
- GitHub repository refresh with loading, error, and saved-data fallback states
- Optional Behance proxy ingestion with loading, error, and saved-data fallback states
- Hosted publishing contract with durable slug URLs and published-view loading
- Optional privacy-first analytics with Do Not Track support
- Responsive design tuned for desktop and mobile
- Reduced-motion support for accessibility
- Local portfolio editor with persistence and JSON import/export
- Theme presets with live preview and dynamic SEO metadata
- Public preview mode for sharing the portfolio without editor controls
- Publishing readiness checks for identity, story, work, contact, and public URL quality
- Optional GitHub repository sync with local fallback data
- Editable Behance project collection with persistent visual content
- Automated GitHub Pages deployment from `main`
- Cleaner architecture for future CMS and publishing expansion
- Site customization roadmap for navigation, sections, branding, favicon, and footer administration

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS v4
- Framer Motion
- Lucide React

## Architecture

```text
src/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── navigation/
│   ├── portfolio/
│   └── ...
├── data/
├── lib/
├── types/
├── App.tsx
└── main.tsx
```

## Site administration

FolioSpark separates professional content from presentation settings:

- `Portfolio` contains profile, work, experience, services, case studies, and social content.
- `SiteSettings` contains the site title, description, logo, favicon, navigation, footer, and section visibility.

This separation allows the entire public site to be customized without turning visual components into a collection of hardcoded form fields. Legacy portfolio exports remain valid because `siteSettings` is optional and receives safe defaults when loaded.

The administration roadmap is organized into these stages:

1. Site Settings Foundation
2. Navigation Builder
3. Section Visibility and Ordering
4. Branding, title, metadata, and favicon
5. Footer Builder
6. Administration UI System
7. Editor productivity with auto-save and undo/redo
8. Visual QA and publishing confidence

The current active stage is always reported in implementation updates. Each stage must include its goal, completed work, remaining work, validation results, and the next recommended stage.

### Recommended administration UI

The current stack is sufficient for the public portfolio. For the editor surface, the recommended accessible primitives are Radix UI with shadcn/ui-owned components:

```bash
npx shadcn@latest init
npx shadcn@latest add tabs switch select dialog popover tooltip separator input textarea alert
```

These components should be introduced gradually and customized to FolioSpark's existing tokens. Do not add a second design system or replace the editorial public interface with a generic admin theme.

For accessible section reordering in a later stage:

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

`@dnd-kit` should not be added until basic section visibility and settings persistence are stable.

## Local Development

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal to view the app.

## Production Build

```bash
npm run build
```

## Public Preview

With the development server running, open `/?view=public`:

```text
http://localhost:5173/?view=public
```

This view hides the editor and theme controls and the generated link includes the current portfolio data and theme so it can be shared as a public-facing snapshot.

The public portfolio is available at `/`. Administration is intentionally separated at `/admin`:

```text
http://localhost:5173/          # public portfolio
http://localhost:5173/admin     # local administration UI
http://localhost:5173/?view=public
http://localhost:5173/?view=published&slug=your-slug
```

The `/admin` route is currently a client-side boundary for the static app. It prevents the editor from rendering on the public route, but it is not server-side authentication. Add authentication and authorization in the publishing API before treating `/admin` as a protected production control plane.

## Deployment

Pushes to `main` build and deploy the static site through GitHub Pages using the workflow in `.github/workflows/deploy.yml`.

In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The default project URL is:

```text
https://felipemvrin.github.io/foliospark/
```

For a custom domain, set `APP_SITE_URL` in the deployment environment before building. The generated canonical URL, asset base path, and root-level `robots.txt`/`sitemap.xml` output will use that value.

Hosted publishing uses an optional `VITE_PUBLISHING_API_URL`. The API should expose `GET /portfolios/:slug` and `PUT /portfolios/:slug`, returning `{ "portfolio": Portfolio, "theme": ThemePresetName, "slug": string }`. The editor publishes to that endpoint, and a durable public URL loads the portfolio with `/?view=published&slug=your-slug`. Keep authentication and storage credentials in the server-side API.

Analytics uses an optional `VITE_ANALYTICS_ENDPOINT` that accepts `POST` events. It is disabled when unset, sends no cookies or personal profile data, and respects the browser's Do Not Track preference. The client sends `page_view` and `outbound_click` events with a coarse destination label.

For production publishing, `VITE_PUBLISHING_API_URL` must use HTTPS and must not contain credentials, query parameters, or fragments. HTTP is accepted only for local `localhost`/`127.0.0.1` development. Keep authentication, authorization, rate limiting, CORS, and storage credentials in the publishing API; the frontend must never contain a secret token.

For static hosting, configure these response headers at the CDN or hosting provider:

```text
Content-Security-Policy: default-src 'self'; img-src 'self' https: data:; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https:; font-src 'self' https: data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

The CSP should be reviewed whenever a new external image, analytics, publishing, or font provider is added. If the deployment platform supports it, add `Strict-Transport-Security: max-age=31536000; includeSubDomains` after HTTPS is confirmed for every subdomain.

To connect Behance through a server-side proxy, set `VITE_BEHANCE_PROXY_URL` before building. The browser only calls this proxy; Behance credentials should remain on the server. Without this variable, FolioSpark uses the projects saved in the local portfolio data.

## Roadmap

- Phase 35: Site Settings Foundation, currently in progress
- Phase 36: Navigation Builder
- Phase 37: Section Visibility and Ordering
- Phase 38: Branding, metadata, and customizable SVG favicon
- Phase 39: Footer Builder
- Phase 40: `/admin` route boundary and Administration UI System, currently in progress
- Phase 41: Editor productivity with auto-save, undo/redo, and draft clarity
- Phase 42: Visual QA, accessibility, performance, and publishing confidence
- Later: hosted analytics dashboard and retention reports

## Screenshots

Placeholder for future screenshots of the portfolio landing page and editor UI.

## License

MIT
