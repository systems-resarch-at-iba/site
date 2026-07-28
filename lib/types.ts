// Content model, extended with `category` (a single primary
// grouping used for the meta line + blog index filter) alongside the plural
// `tags` (used for the post page's tag-chip row). This mirrors the
// category+tags split already used in the personal-website content pipeline
// this project's markdown workflow is ported from.

export type AuthorRef = {
  name: string
  slug: string
  avatar?: string
  bio: string
  github?: string
}

export type Post = {
  slug: string
  title: string
  excerpt: string // ~160 chars, shown on cards + meta description
  body: string // markdown, may contain raw HTML blocks
  coverImage?: string
  category: string
  tags: string[]
  author: AuthorRef
  publishedAt: string | null // null while draft
  updatedAt: string
  readingMinutes: number // computed from body word count
  status: 'draft' | 'published'
}

export type Project = {
  repo: string // "org/name"
  description: string
  status: 'active' | 'archived'
  // stars, language(s), lastUpdated fetched live from GitHub API, not stored
}

export type RepoDetails = Project & {
  name: string
  stars: number
  language: string
  lastUpdated: string
  url: string
}

export type Playground = {
  slug: string
  title: string
  description: string
}

export type Contributor = {
  slug: string
  name: string
  tier: 'lead' | 'core' | 'contributor'
  role: string // e.g. "Principal Investigator", "PhD Researcher"
  bio?: string // required for "lead", optional one-liner for "core", unused for "contributor"
  avatar?: string
  email?: string
  github?: string
  website?: string
  linkedin?: string
  links?: { label: string; url: string }[]
}
