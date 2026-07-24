import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { relativeTime, isStale, getRepos } from '../../lib/github'

function daysAgo(days: number): string {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
}

describe('relativeTime', () => {
  it('reports today for anything under 1 day old', () => {
    expect(relativeTime(daysAgo(0))).toBe('today')
  })

  it('uses singular phrasing for exactly 1 day/week/month/year', () => {
    expect(relativeTime(daysAgo(1))).toBe('1 day ago')
    expect(relativeTime(daysAgo(7))).toBe('1 week ago')
    // Not day 30: floor(30/7)=4 weeks, and the weeks-branch (< 5 weeks)
    // catches it before the months-branch ever sees it: day 35 is the
    // first day that actually falls through to "1 month ago".
    expect(relativeTime(daysAgo(35))).toBe('1 month ago')
    expect(relativeTime(daysAgo(365))).toBe('1 year ago')
  })

  it('uses plural phrasing and the right unit as time increases', () => {
    expect(relativeTime(daysAgo(3))).toBe('3 days ago')
    expect(relativeTime(daysAgo(14))).toBe('2 weeks ago')
    expect(relativeTime(daysAgo(30))).toBe('4 weeks ago')
    expect(relativeTime(daysAgo(90))).toBe('3 months ago')
    expect(relativeTime(daysAgo(800))).toBe('2 years ago')
  })
})

describe('isStale', () => {
  it('is false for a repo pushed to recently', () => {
    expect(isStale(daysAgo(1))).toBe(false)
  })

  it('is false at just under 6 months', () => {
    expect(isStale(daysAgo(179))).toBe(false)
  })

  it('is true past 6 months of inactivity', () => {
    expect(isStale(daysAgo(181))).toBe(true)
  })
})

describe('getRepos', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns [] and logs instead of throwing when the API responds with an error status', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 404 }))
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(await getRepos()).toEqual([])
    expect(errorSpy).toHaveBeenCalled()
  })

  it('returns [] and logs instead of throwing when the network call itself fails', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('network down'))
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(await getRepos()).toEqual([])
    expect(errorSpy).toHaveBeenCalled()
  })

  it('filters out forks and maps fields from the GitHub API shape', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            name: 'real-repo',
            full_name: 'someone/real-repo',
            html_url: 'https://github.com/someone/real-repo',
            description: 'A real repo',
            stargazers_count: 5,
            language: 'Rust',
            pushed_at: daysAgo(1),
            archived: false,
            fork: false,
          },
          {
            name: 'a-fork',
            full_name: 'someone/a-fork',
            html_url: 'https://github.com/someone/a-fork',
            description: null,
            stargazers_count: 0,
            language: null,
            pushed_at: daysAgo(1),
            archived: false,
            fork: true,
          },
        ]),
        { status: 200 }
      )
    )

    const repos = await getRepos()
    expect(repos).toHaveLength(1)
    expect(repos[0]).toMatchObject({
      repo: 'someone/real-repo',
      name: 'real-repo',
      description: 'A real repo',
      stars: 5,
      language: 'Rust',
      status: 'active',
    })
  })

  it('falls back to placeholder text for a null description/language on a non-fork repo', async () => {
    // The only null-valued fixture in the test above is the forked repo,
    // which gets filtered out before the ?? fallbacks even run, so that test
    // can't actually prove the fallbacks work. This one keeps fork: false.
    vi.mocked(fetch).mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            name: 'sparse-repo',
            full_name: 'someone/sparse-repo',
            html_url: 'https://github.com/someone/sparse-repo',
            description: null,
            stargazers_count: 0,
            language: null,
            pushed_at: daysAgo(1),
            archived: false,
            fork: false,
          },
        ]),
        { status: 200 }
      )
    )

    const repos = await getRepos()
    expect(repos).toHaveLength(1)
    expect(repos[0].description).toBe('No description provided.')
    expect(repos[0].language).toBe('Unknown')
  })
})
