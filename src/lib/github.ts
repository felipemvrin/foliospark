import type { GitHubProject } from '../types/portfolio'

interface GitHubRepository {
  name: string
  description: string | null
  language: string | null
  stargazers_count: number
  forks_count: number
  html_url: string
  pushed_at: string | null
}

function getUsername(url: string) {
  try {
    const parsedUrl = new URL(url)
    const [username] = parsedUrl.pathname.split('/').filter(Boolean)

    return parsedUrl.hostname === 'github.com' && username ? username : null
  } catch {
    return null
  }
}

export function isGitHubProfileUrl(url: string) {
  return getUsername(url) !== null
}

export async function fetchGitHubProjects(url: string, signal?: AbortSignal): Promise<GitHubProject[] | null> {
  const username = getUsername(url)

  if (!username) {
    return null
  }

  const response = await fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=6`,
    { headers: { Accept: 'application/vnd.github+json' }, signal },
  )

  if (!response.ok) {
    throw new Error(`GitHub request failed with ${response.status}`)
  }

  const repositories = (await response.json()) as GitHubRepository[]

  return repositories.map((repository) => ({
    repository: repository.name,
    description: repository.description ?? 'No repository description yet.',
    language: repository.language ?? 'Code',
    stars: repository.stargazers_count,
    forks: repository.forks_count,
    url: repository.html_url,
    updatedAt: repository.pushed_at
      ? `Updated ${new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(new Date(repository.pushed_at))}`
      : 'Updated recently',
  }))
}