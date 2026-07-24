import type { RepoDetails } from './types'

const GITHUB_ACCOUNT = 'systems-resarch-at-iba'

interface GitHubApiRepo {
  name: string
  full_name: string
  html_url: string
  description: string | null
  stargazers_count: number
  language: string | null
  pushed_at: string
  archived: boolean
  fork: boolean
}

const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 30 * 6

// Ignores GitHub's own `archived` flag (that only reflects whether the
// owner explicitly archived it) in favor of actual activity: a repo with
// no push in 6 months reads as archived here, regardless of that flag.
export function isStale(pushedAt: string): boolean {
  return Date.now() - new Date(pushedAt).getTime() > SIX_MONTHS_MS
}

export function relativeTime(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24))
  if (days < 1) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 5) return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
  const months = Math.floor(days / 30)
  if (months < 12) return months <= 1 ? '1 month ago' : `${months} months ago`
  const years = Math.floor(days / 365)
  return years <= 1 ? '1 year ago' : `${years} years ago`
}

// Fetches real public repos directly from the GitHub REST API,
// unauthenticated, since this only ever needs to show what's already
// public. Cached for an hour (Next's fetch-level revalidation) rather than
// hit the API on every request; unauthenticated calls are capped at 60/hr
// per IP, which a per-hour revalidation comfortably stays under.
export async function getRepos(): Promise<RepoDetails[]> {
  try {
    const res = await fetch(`https://api.github.com/orgs/${GITHUB_ACCOUNT}/repos?per_page=100`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.error(`GitHub API error fetching ${GITHUB_ACCOUNT}'s repos: ${res.status}`)
      return []
    }

    const repos: GitHubApiRepo[] = await res.json()

    return repos
      .filter((repo) => !repo.fork)
      .sort((a, b) => b.pushed_at.localeCompare(a.pushed_at))
      .map((repo) => ({
        repo: repo.full_name,
        name: repo.name,
        description: repo.description ?? 'No description provided.',
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language ?? 'Unknown',
        lastUpdated: relativeTime(repo.pushed_at),
        status: isStale(repo.pushed_at) ? 'archived' : 'active',
      }))
  } catch (err) {
    console.error(`Failed to fetch ${GITHUB_ACCOUNT}'s repos:`, err)
    return []
  }
}
