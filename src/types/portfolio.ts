export type SocialPlatform =
  | 'github'
  | 'behance'
  | 'linkedin'
  | 'instagram'
  | 'x'
  | 'website'

export interface SocialLink {
  platform: SocialPlatform
  label: string
  url: string
}

export interface Profile {
  name: string
  role: string
  headline: string
  bio: string
  location: string
  email: string
  phone: string
  website: string
  slug?: string
  photo: string
}

export interface Experience {
  company: string
  role: string
  period: string
  description: string
  technologies: string[]
}

export interface Education {
  institution: string
  degree: string
  period: string
  description: string
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface Project {
  title: string
  category: string
  year: string
  description: string
  image: string
  technologies: string[]
  website?: string
  github?: string
  behance?: string
}

export interface GitHubProject {
  repository: string
  description: string
  language: string
  stars: number
  forks: number
  url: string
  updatedAt: string
}

export interface BehanceProject {
  title: string
  description: string
  cover: string
  url: string
  category: string
  publishedAt: string
  tags: string[]
}

export interface PortfolioMetric {
  value: string
  label: string
}

export interface Portfolio {
  profile: Profile
  metrics: PortfolioMetric[]
  about: string[]
  experience: Experience[]
  education: Education[]
  skills: SkillGroup[]
  projects: Project[]
  githubProjects: GitHubProject[]
  behanceProjects: BehanceProject[]
  socialLinks: SocialLink[]
}
