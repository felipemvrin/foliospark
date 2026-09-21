import type { Portfolio } from '../types/portfolio.js'

export const portfolio: Portfolio = {
  profile: {
    name: 'Aster Vale',
    role: 'Design Engineer',
    headline: 'Crafting digital identities with motion, systems, and story.',
    bio:
      'I build expressive product experiences that help founders and studios turn complex ideas into polished digital stories.',
    location: 'Tokyo / Remote',
    email: 'hello@astervale.studio',
    phone: '+81 90 1234 5678',
    website: 'astervale.studio',
    siteUrl: 'https://www.astervale.studio',
    slug: 'aster-vale',
    photo:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80',
  },
  metrics: [
    { value: '8+', label: 'years building' },
    { value: '34', label: 'launches shipped' },
    { value: '12', label: 'active studios' },
  ],
  about: [
    'FolioSpark is a data-first portfolio system built for creatives who want their work to feel premium, human, and highly intentional.',
    'The system pairs editorial composition, responsive motion, and practical storytelling so a personal portfolio feels more like a living identity than a static CV.',
  ],
  process: [
    {
      title: 'Frame the brief',
      description: 'I turn scattered notes, ambitions, and market context into a clear story arc.',
      detail: 'Discovery and strategic alignment set the tone before any visuals are designed.',
    },
    {
      title: 'Shape the system',
      description: 'The visual language, hierarchy, and motion are defined as one coherent product experience.',
      detail: 'Design systems keep the work expressive without losing clarity or speed.',
    },
    {
      title: 'Build with intent',
      description: 'I move from prototype to production with accessibility, performance, and trust in mind.',
      detail: 'Every interaction is intentional, responsive, and designed to support the message.',
    },
    {
      title: 'Refine and launch',
      description: 'Final polish focuses on conversion, audience clarity, and a memorable first impression.',
      detail: 'The final launch feels premium because the product and story have been aligned from the start.',
    },
  ],
  testimonials: [
    {
      quote: 'Aster made our positioning feel clearer, warmer, and far more premium. The final narrative didn’t just look good; it changed how people understood the business.',
      name: 'Mila Rowan',
      role: 'Founder',
      company: 'Northstar Labs',
    },
    {
      quote: 'The work balanced storytelling with production discipline. We got a portfolio that felt distinctive and a process that was easy to trust from day one.',
      name: 'Kenji Sato',
      role: 'Creative Director',
      company: 'Mori Atelier',
    },
  ],
  services: [
    {
      name: 'Brand Positioning',
      price: '$2,400',
      description: 'A focused design sprint for founders who need sharper story, stronger message, and more persuasive visuals.',
      features: ['Strategic positioning', 'Visual system direction', 'Launch-ready story framing'],
      featured: true,
    },
    {
      name: 'Portfolio Experience',
      price: '$3,800',
      description: 'A premium portfolio build for individuals and studios that want their work to feel memorable and credible.',
      features: ['Art direction', 'Responsive storytelling', 'Editing and copy refinement'],
    },
    {
      name: 'Product Narrative',
      price: '$5,600',
      description: 'A deeper product storytelling and interface package for brands that need a stronger digital presence.',
      features: ['Messaging system', 'UX and landing flow', 'Conversion-focused polish'],
    },
  ],
  experience: [
    {
      company: 'Northstar Labs',
      role: 'Senior Product Designer',
      period: '2022 — Present',
      description:
        'Led design systems and discovery for consumer products across B2B and SaaS verticals, balancing brand storytelling with measurable product growth.',
      technologies: ['Design Systems', 'Motion', 'Research', 'Figma'],
    },
    {
      company: 'Mori Atelier',
      role: 'Creative Technologist',
      period: '2019 — 2022',
      description:
        'Built launch pages, immersive narratives, and interactive prototypes for clients in culture, fashion, and product design.',
      technologies: ['React', 'Three.js', 'Brand', 'Interaction'],
    },
    {
      company: 'Kite & Co.',
      role: 'Visual Designer',
      period: '2016 — 2019',
      description:
        'Shaped visual language, campaign art direction, and user interfaces for web-first brands with strong editorial identities.',
      technologies: ['Art Direction', 'UI', 'Brand', 'Content'],
    },
  ],
  education: [
    {
      institution: 'Tokyo University of the Arts',
      degree: 'B.A. in Design & Media',
      period: '2012 — 2016',
      description: 'Focused on visual culture, interaction design, and experimental communication systems.',
    },
    {
      institution: 'School of Motion',
      degree: 'Advanced Motion Design',
      period: '2018',
      description: 'Deepened motion language, narrative pacing, and interface physics for digital products.',
    },
  ],
  skills: [
    {
      category: 'Design',
      items: ['Brand Systems', 'Interface Design', 'Editorial Layout', 'Design Prototyping'],
    },
    {
      category: 'Product',
      items: ['Product Strategy', 'UX Writing', 'Discovery', 'Design Ops'],
    },
    {
      category: 'Development',
      items: ['React', 'TypeScript', 'Motion', 'Accessibility'],
    },
    {
      category: 'Creative',
      items: ['Art Direction', 'Campaign Design', 'Storytelling', '3D Direction'],
    },
  ],
  projects: [
    {
      title: 'Northstar Pulse',
      category: 'Product Experience',
      year: '2025',
      description:
        'A product storytelling platform for teams turning raw operational metrics into a premium visual narrative.',
      image:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
      technologies: ['Design Systems', 'React', 'Analytics', 'Motion'],
      caseStudy: {
        challenge: 'The team had strong operational data, but no clear narrative for turning that complexity into a confident buying decision.',
        approach: 'We shaped the product around a simple rhythm: frame the signal, show the context, and make the next action obvious.',
        outcome: 'A calmer dashboard and sharper launch story gave the team a clearer way to demonstrate value in every sales conversation.',
        metrics: [
          { value: '32%', label: 'faster first-session comprehension' },
          { value: '2.4x', label: 'more qualified demo requests' },
        ],
      },
      website: 'https://example.com',
      github: 'https://github.com',
    },
    {
      title: 'Studio Kumo',
      category: 'Brand Platform',
      year: '2024',
      description:
        'A digital identity system designed for a culture-driven studio blending editorial rhythm with product clarity.',
      image:
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
      technologies: ['Brand Art Direction', 'UI', 'Web', 'Campaign'],
      caseStudy: {
        challenge: 'A culture-led studio needed a digital identity that could feel expressive without making its work difficult to scan or understand.',
        approach: 'We paired an editorial type system with restrained motion, giving each project room to speak while keeping the navigation direct.',
        outcome: 'The new platform made the studio easier to remember and gave every pitch a more consistent visual point of view.',
        metrics: [
          { value: '41%', label: 'longer average project viewing time' },
          { value: '5', label: 'new inbound collaborations' },
        ],
      },
      behance: 'https://behance.net',
    },
    {
      title: 'Mono Signal',
      category: 'Interface Craft',
      year: '2023',
      description:
        'An editor-first workspace for cross-platform product teams, designed to feel calm, structured, and expressive.',
      image:
        'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
      technologies: ['UX Strategy', 'Prototype', 'Figma', 'Research'],
      caseStudy: {
        challenge: 'Distributed product teams were losing time between research, decisions, and the handoff into production.',
        approach: 'We created an editor-first workspace that made rationale visible and turned scattered feedback into a shared working language.',
        outcome: 'Teams moved through critique with more confidence because the interface made both the decision and its context easy to revisit.',
        metrics: [
          { value: '28%', label: 'fewer duplicated decisions' },
          { value: '3 days', label: 'saved per sprint cycle' },
        ],
      },
      website: 'https://example.com',
      github: 'https://github.com',
    },
  ],
  githubProjects: [
    {
      repository: 'folio-atelier',
      description: 'A modular portfolio builder with polished, data-driven content patterns and CMS-ready architecture.',
      language: 'TypeScript',
      stars: 148,
      forks: 34,
      url: 'https://github.com',
      updatedAt: 'Updated 3 days ago',
    },
    {
      repository: 'motion-systems',
      description: 'Motion primitives and interaction patterns for premium interfaces with reduced-motion support.',
      language: 'React',
      stars: 96,
      forks: 19,
      url: 'https://github.com',
      updatedAt: 'Updated 1 week ago',
    },
  ],
  behanceProjects: [
    {
      title: 'Dawn Archive',
      description: 'Editorial identity exploration for a cultural publication with motion-led storytelling.',
      cover:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80',
      url: 'https://behance.net',
      category: 'Editorial Design',
      publishedAt: 'May 2025',
      tags: ['Brand', 'Motion', 'Culture'],
    },
    {
      title: 'Signal Objects',
      description: 'A study in tactile interfaces, spatial rhythm, and modern product narratives.',
      cover:
        'https://images.unsplash.com/photo-1497366412874-3415097a27e7?auto=format&fit=crop&w=1200&q=80',
      url: 'https://behance.net',
      category: 'Interaction Design',
      publishedAt: 'January 2025',
      tags: ['Interface', 'Prototype', 'Systems'],
    },
  ],
  socialLinks: [
    { platform: 'github', label: 'GitHub', url: 'https://github.com' },
    { platform: 'behance', label: 'Behance', url: 'https://behance.net' },
    { platform: 'linkedin', label: 'LinkedIn', url: 'https://linkedin.com' },
    { platform: 'instagram', label: 'Instagram', url: 'https://instagram.com' },
    { platform: 'x', label: 'X', url: 'https://x.com' },
    { platform: 'website', label: 'Website', url: 'https://astervale.studio' },
  ],
}
