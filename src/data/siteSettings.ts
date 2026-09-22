import type { SiteSettings } from '../types/portfolio'

export const defaultSiteSettings: SiteSettings = {
  title: 'FolioSpark',
  description: 'A premium portfolio and CV builder for expressive professional stories.',
  logoText: 'FolioSpark',
  logoMark: 'F',
  navigation: {
    visible: true,
    items: [
      { id: 'about', label: 'About', target: '#about', visible: true },
      { id: 'work', label: 'Work', target: '#work', visible: true },
      { id: 'process', label: 'Process', target: '#process', visible: true },
      { id: 'services', label: 'Services', target: '#services', visible: true },
      { id: 'github', label: 'GitHub', target: '#github', visible: true },
      { id: 'journal', label: 'Journal', target: '#journal', visible: true },
      { id: 'resume', label: 'Resume', target: '#resume', visible: true },
      { id: 'contact', label: 'Contact', target: '#contact', visible: true },
    ],
    ctaLabel: 'Start a project',
    ctaTarget: '#contact',
  },
  footer: {
    visible: true,
    copyright: 'FolioSpark © 2026',
    tagline: 'Your professional story, in motion.',
    showLocation: true,
    showSocialLinks: true,
    links: [],
  },
  sections: [
    { id: 'about', visible: true },
    { id: 'work', visible: true },
    { id: 'process', visible: true },
    { id: 'services', visible: true },
    { id: 'trust', visible: true },
    { id: 'github', visible: true },
    { id: 'journal', visible: true },
    { id: 'behance', visible: true },
    { id: 'experience', visible: true },
    { id: 'skills', visible: true },
    { id: 'resume', visible: true },
    { id: 'faq', visible: true },
    { id: 'contact', visible: true },
  ],
}

export function createDefaultSiteSettings(): SiteSettings {
  return JSON.parse(JSON.stringify(defaultSiteSettings)) as SiteSettings
}

export function getSiteSettings(settings: SiteSettings | undefined): SiteSettings {
  if (!settings) {
    return createDefaultSiteSettings()
  }

  return settings
}
