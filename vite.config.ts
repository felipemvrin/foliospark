import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { portfolio } from './src/data/portfolio.js'
import { getSeoMetadata } from './src/lib/seo.js'

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

const defaultSeoMetadata = getSeoMetadata(portfolio.profile, 'Minimal')

export default defineConfig({
  base: process.env.GITHUB_ACTIONS ? '/foliospark/' : '/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'foliospark-seo-metadata',
      transformIndexHtml(html) {
        return html
          .replaceAll('%APP_TITLE%', escapeHtmlAttribute(defaultSeoMetadata.title))
          .replaceAll('%APP_DESCRIPTION%', escapeHtmlAttribute(defaultSeoMetadata.description))
          .replaceAll('%APP_THEME_COLOR%', escapeHtmlAttribute(defaultSeoMetadata.themeColor))
          .replaceAll('%APP_OG_IMAGE%', escapeHtmlAttribute(defaultSeoMetadata.image))
      },
    },
  ],
})
