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
