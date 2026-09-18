# FolioSpark

FolioSpark is a premium portfolio and CV builder designed for creatives, developers, and product-minded professionals who want their work to feel alive, intentional, and editorial.

## Overview

This project is built as a modern React + TypeScript + Vite application with a data-first architecture so the public portfolio can be updated by editing structured content rather than rewriting components.

## Features

- Editorial, motion-led landing experience
- Data-driven portfolio structure for profile, projects, experience, education, and skills
- GitHub and Behance-ready content models
- Responsive design tuned for desktop and mobile
- Reduced-motion support for accessibility
- Local portfolio editor with persistence and JSON import/export
- Theme presets with live preview and dynamic SEO metadata
- Public preview mode for sharing the portfolio without editor controls
- Cleaner architecture for future CMS and publishing expansion

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

This view hides the editor and theme controls so the portfolio can be reviewed as a public-facing page.

## Roadmap

- Public publishing flow and custom portfolio URLs
- SEO metadata and social sharing controls
- GitHub API integration
- Behance content ingestion
- Hosted portfolio deployment

## Screenshots

Placeholder for future screenshots of the portfolio landing page and editor UI.

## License

MIT
