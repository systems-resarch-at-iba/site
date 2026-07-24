import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { getAllPosts, getPostSlugs, getPostBySlug, getAdjacentPosts } from '../../lib/posts'

vi.mock('node:fs', () => ({
  default: {
    readdirSync: vi.fn(),
    readFileSync: vi.fn(),
    existsSync: vi.fn(),
  },
}))

// Controlled fixtures, independent of whatever is currently in content/posts/,
// so filtering/ordering/adjacency logic is verified directly rather than
// relying on the real submodule content happening to exercise every branch
// (e.g. it currently has zero drafts, so a status-filter regression there
// would go unnoticed without a fixture that actually includes one).
const FIXTURES: Record<string, string> = {
  'newest-published.md': `---
title: "Newest Post"
date: "2026-02-01"
author: systems-research-team
category: "Testing"
tags: []
excerpt: "The newest published post."
status: published
---

Body of the newest post.
`,
  'middle-published.md': `---
title: "Middle Post"
date: "2026-01-15"
author: systems-research-team
category: "Testing"
tags: []
excerpt: "The middle published post."
status: published
---

Body of the middle post.
`,
  'oldest-published.md': `---
title: "Oldest Post"
date: "2026-01-01"
author: systems-research-team
category: "Testing"
tags: []
excerpt: "The oldest published post."
status: published
---

Body of the oldest post.
`,
  'a-draft.md': `---
title: "Unfinished Draft"
date: "2026-03-01"
author: systems-research-team
category: "Testing"
tags: []
excerpt: "Not ready yet."
status: draft
---

This should never reach the live site.
`,
}

function setFixtures(files: Record<string, string>) {
  vi.mocked(fs.readdirSync).mockReturnValue(Object.keys(files) as unknown as ReturnType<typeof fs.readdirSync>)
  vi.mocked(fs.readFileSync).mockImplementation((filePath) => {
    const name = path.basename(filePath.toString())
    if (!(name in files)) throw new Error(`unexpected readFileSync: ${name}`)
    return files[name]
  })
  vi.mocked(fs.existsSync).mockImplementation((filePath) => {
    const name = path.basename(filePath.toString())
    return name === 'posts' || name in files
  })
}

beforeEach(() => {
  setFixtures(FIXTURES)
})

afterEach(() => {
  vi.resetAllMocks()
})

describe('getAllPosts', () => {
  it('excludes README.md (the blog submodule repo carries its own)', () => {
    setFixtures({ ...FIXTURES, 'README.md': '# not a post' })
    const slugs = getAllPosts().map((p) => p.slug)
    expect(slugs).not.toContain('README')
  })

  it('excludes drafts entirely, not just from ordering', () => {
    const slugs = getAllPosts().map((p) => p.slug)
    expect(slugs).not.toContain('a-draft')
    expect(slugs).toHaveLength(3)
  })

  it('sorts strictly newest-first by publish date', () => {
    const slugs = getAllPosts().map((p) => p.slug)
    expect(slugs).toEqual(['newest-published', 'middle-published', 'oldest-published'])
  })
})

describe('getPostBySlug', () => {
  it('returns undefined for a slug that does not exist', () => {
    expect(getPostBySlug('does-not-exist')).toBeUndefined()
  })

  it('returns undefined for a draft slug, even though the file exists', () => {
    // Regression test: getPostBySlug used to skip the status check that
    // getAllPosts applies, so a draft was excluded from the index but still
    // fully renderable at its direct URL, contradicting the documented
    // "drafts don't appear on the live site" guarantee.
    expect(getPostBySlug('a-draft')).toBeUndefined()
  })

  it('returns the rendered post with matching fields for a published slug', () => {
    const post = getPostBySlug('middle-published')
    expect(post?.slug).toBe('middle-published')
    expect(post?.title).toBe('Middle Post')
    expect(post?.status).toBe('published')
    expect(post?.html).toContain('Body of the middle post')
  })
})

describe('getPostSlugs', () => {
  it('matches getAllPosts, excluding drafts', () => {
    expect(getPostSlugs()).toEqual(['newest-published', 'middle-published', 'oldest-published'])
  })
})

describe('getAdjacentPosts', () => {
  it('returns null/null for an unknown slug', () => {
    expect(getAdjacentPosts('does-not-exist')).toEqual({ prev: null, next: null })
  })

  it('has no next (newer) post for the newest post', () => {
    const { next } = getAdjacentPosts('newest-published')
    expect(next).toBeNull()
  })

  it('has no prev (older) post for the oldest post', () => {
    const { prev } = getAdjacentPosts('oldest-published')
    expect(prev).toBeNull()
  })

  it('gives the middle post its correct older and newer neighbors', () => {
    const { prev, next } = getAdjacentPosts('middle-published')
    expect(prev?.slug).toBe('oldest-published')
    expect(next?.slug).toBe('newest-published')
  })

  it('never returns a draft as a neighbor', () => {
    // The draft is newer than every published post; if it leaked into the
    // adjacency chain, the newest published post's "next" would wrongly
    // resolve to it instead of staying null.
    const { next } = getAdjacentPosts('newest-published')
    expect(next).toBeNull()
  })
})
