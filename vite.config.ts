import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { portfolio } from './src/data/portfolio.js'
import {
  buildRobotsTxt,
  buildSitemapXml,
  getCanonicalSiteUrl,
  getSeoMetadata,
  getSiteBasePath,
  shouldGenerateRobotsTxt,
} from './src/lib/seo.js'

function escapeHtmlAttribute(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const repositoryOwner = process.env.GITHUB_REPOSITORY?.split('/')[0]
const defaultSiteUrl = process.env.APP_SITE_URL
  ?? (process.env.GITHUB_ACTIONS && repositoryOwner && repositoryName
    ? `https://${repositoryOwner}.github.io/${repositoryName}/`
    : 'http://localhost:5173/')
const pagesBasePath = process.env.GITHUB_ACTIONS ? getSiteBasePath(defaultSiteUrl) : '/'
const defaultSeoMetadata = getSeoMetadata(portfolio.profile, 'Minimal', defaultSiteUrl)
const staticSiteUrl = getCanonicalSiteUrl(portfolio.profile.siteUrl ?? '', defaultSiteUrl)

export default defineConfig({
  base: pagesBasePath,
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
          .replaceAll('%APP_URL%', escapeHtmlAttribute(defaultSeoMetadata.url))
      },
    },
    {
      name: 'foliospark-static-seo-files',
      generateBundle() {
        if (!staticSiteUrl) {
          return
        }

        const sitemap = buildSitemapXml(staticSiteUrl)

        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: sitemap })

        if (shouldGenerateRobotsTxt(defaultSiteUrl) && shouldGenerateRobotsTxt(staticSiteUrl)) {
          this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobotsTxt(staticSiteUrl) })
        }
      },
    },
  ],
})
