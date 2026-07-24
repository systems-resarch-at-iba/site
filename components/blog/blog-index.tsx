'use client'

import { useMemo, useState } from 'react'
import { SearchInput } from '../ui/search-input'
import { TabRow } from '../ui/tab-row'
import { PostCard } from './post-card'
import { Button } from '../ui/button'
import type { Post } from '@/lib/types'

interface BlogIndexProps {
  posts: (Post & { dateLabel: string })[]
}

const POSTS_PER_PAGE = 6

export function BlogIndex({ posts }: BlogIndexProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [page, setPage] = useState(1)

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts]
  )

  const filtered = useMemo(() => {
    let result = posts
    if (query) {
      const q = query.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    if (category !== 'All') {
      result = result.filter((p) => p.category === category)
    }
    return result
  }, [posts, query, category])

  const visible = filtered.slice(0, page * POSTS_PER_PAGE)
  const hasMore = visible.length < filtered.length

  return (
    <>
      <section className="mx-auto mb-8 max-w-[1120px] px-6">
        <SearchInput
          value={query}
          onChange={(v) => {
            setQuery(v)
            setPage(1)
          }}
        />
      </section>

      <section className="mx-auto mb-12 max-w-[1120px] px-6">
        <TabRow
          items={categories.map((c) => ({ label: c, value: c }))}
          active={category}
          onChange={(v) => {
            setCategory(v)
            setPage(1)
          }}
        />
      </section>

      <section className="mx-auto mb-12 max-w-[1120px] px-6">
        {visible.length > 0 ? (
          <>
            <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
              {visible.map((post) => (
                <PostCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  author={post.author.name}
                  date={post.dateLabel}
                  tag={post.category}
                  readingTime={`${post.readingMinutes} min`}
                />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center">
                <Button variant="secondary" onClick={() => setPage((p) => p + 1)}>
                  Load more posts
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="py-12 text-center">
            <p className="font-serif text-ink-muted">
              {query
                ? `No posts match "${query}." Try a different term or clear filters.`
                : 'No posts in this category yet.'}
            </p>
          </div>
        )}
      </section>
    </>
  )
}
