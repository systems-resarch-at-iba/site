'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { SearchInput } from '../ui/search-input'
import type { Playground } from '@/lib/types'

export function PlaygroundGrid({ playgrounds }: { playgrounds: Playground[] }) {
  const [query, setQuery] = useState('')

  const visible = useMemo(() => {
    if (!query) return playgrounds
    const q = query.toLowerCase()
    return playgrounds.filter(
      (p) => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    )
  }, [playgrounds, query])

  return (
    <>
      <section className="mx-auto mb-8 max-w-[1120px] px-6">
        <SearchInput placeholder="Search playgrounds..." value={query} onChange={setQuery} />
      </section>

      <section className="mx-auto mb-16 max-w-[1120px] px-6">
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {visible.map((playground) => (
              <Link
                key={playground.slug}
                href={`/playground/${playground.slug}`}
                className="group rounded-md border border-hairline bg-paper-raised p-6 transition-colors hover:border-hairline-strong"
              >
                <h3 className="mb-3 font-display text-lg font-semibold text-ink transition-colors group-hover:text-signal">
                  {playground.title}
                </h3>
                <p className="mb-4 font-serif text-sm text-ink-muted">{playground.description}</p>
                <span className="font-sans text-xs font-medium text-signal transition-colors group-hover:text-signal-ink">
                  Play {'\u2197'}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="font-serif text-ink-muted">
              {query
                ? `No playgrounds match "${query}."`
                : 'No playgrounds yet. Check back soon.'}
            </p>
          </div>
        )}
      </section>
    </>
  )
}
