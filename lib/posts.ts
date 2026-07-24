import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { AUTHORS } from './data'
import { estimateReadingMinutes, renderMarkdown, type RenderedPost } from './markdown'
import type { Post } from './types'

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts')

interface Frontmatter {
  title: string
  date: string
  updatedAt?: string
  author: string // slug into AUTHORS
  category: string
  tags: string[]
  excerpt: string
  coverImage?: string
  status?: 'draft' | 'published'
}

function loadPost(filename: string): Post {
  const slug = filename.replace(/\.md$/, '')
  const raw = fs.readFileSync(path.join(POSTS_DIR, filename), 'utf-8')
  const { data, content } = matter(raw) as unknown as { data: Frontmatter; content: string }

  const author = AUTHORS[data.author]
  if (!author) {
    throw new Error(`content/posts/${filename}: unknown author slug "${data.author}"`)
  }

  return {
    slug,
    title: data.title,
    excerpt: data.excerpt,
    body: content,
    coverImage: data.coverImage,
    category: data.category,
    tags: data.tags ?? [],
    author,
    publishedAt: data.status === 'draft' ? null : data.date,
    updatedAt: data.updatedAt ?? data.date,
    readingMinutes: estimateReadingMinutes(content),
    status: data.status ?? 'published',
  }
}

// Guards against non-post markdown (e.g. a stray README) ending up in
// POSTS_DIR and getting parsed as a post: excluded by name, not silently
// swallowed via a broad try/catch, so a real post with bad frontmatter
// still fails loudly instead of being mistaken for "just another non-post
// file."
const NON_POST_FILES = new Set(['readme.md'])

function allSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs.readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md') && !NON_POST_FILES.has(f.toLowerCase()))
    .map((f) => f.replace(/\.md$/, ''))
}

/** Published posts, newest first. */
export function getAllPosts(): Post[] {
  return allSlugs()
    .map((slug) => loadPost(`${slug}.md`))
    .filter((post) => post.status === 'published')
    .sort((a, b) => (a.publishedAt! < b.publishedAt! ? 1 : -1))
}

export function getPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug)
}

export function getPostBySlug(slug: string): (Post & RenderedPost) | undefined {
  if (!fs.existsSync(path.join(POSTS_DIR, `${slug}.md`))) return undefined
  const post = loadPost(`${slug}.md`)
  if (post.status !== 'published') return undefined
  const { html, toc } = renderMarkdown(post.body)
  return { ...post, html, toc }
}

/** Chronological neighbors (by publish date) for the prev/next post nav. */
export function getAdjacentPosts(slug: string): { prev: Post | null; next: Post | null } {
  const posts = getAllPosts() // newest first
  const index = posts.findIndex((p) => p.slug === slug)
  if (index === -1) return { prev: null, next: null }
  return {
    // "next" reads chronologically forward (older index = newer post)
    next: index > 0 ? posts[index - 1] : null,
    prev: index < posts.length - 1 ? posts[index + 1] : null,
  }
}
