'use client'

import { useMemo, useState } from 'react'
import { TabRow } from '../ui/tab-row'
import { StarIcon } from '../ui/icons'
import { languageColor } from '@/lib/language-colors'
import type { RepoDetails } from '@/lib/types'

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
]

export function ProjectsGrid({ repos }: { repos: RepoDetails[] }) {
  const [filter, setFilter] = useState('all')

  const visible = useMemo(
    () => (filter === 'all' ? repos : repos.filter((r) => r.status === filter)),
    [repos, filter]
  )

  return (
    <>
      <section className="mx-auto mb-12 max-w-[1120px] px-6">
        <TabRow items={FILTERS} active={filter} onChange={setFilter} />
      </section>

      <section className="mx-auto mb-16 max-w-[1120px] px-6">
        {visible.length === 0 ? (
          <p className="py-12 text-center font-serif text-base text-ink-muted">
            No public repositories yet. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {visible.map((repo) => (
              <a
                key={repo.repo}
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-md border border-hairline bg-paper-raised p-6 transition-colors hover:border-hairline-strong"
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-ink transition-colors group-hover:text-signal">
                    {repo.name}
                  </h3>
                  {repo.stars > 0 && (
                    <span className="ml-2 flex items-center gap-1 whitespace-nowrap rounded-sm bg-signal-dim px-2 py-1 font-sans text-sm font-medium text-signal-ink">
                      <StarIcon className="h-3.5 w-3.5 text-[#f5a623]" />
                      {repo.stars.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="mb-4 flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: languageColor(repo.language) }}
                    aria-hidden="true"
                  />
                  <span className="font-mono text-xs text-ink-muted">{repo.language}</span>
                  {repo.status === 'archived' && (
                    <span className="rounded-sm bg-paper px-1.5 py-0.5 font-sans text-[11px] uppercase tracking-wide text-ink-faint">
                      Archived
                    </span>
                  )}
                </div>

                <p className="mb-4 font-serif text-sm text-ink-muted">{repo.description}</p>

                <div className="flex items-center justify-between font-sans text-xs font-medium text-ink-faint">
                  <span>Updated {repo.lastUpdated}</span>
                  <span className="text-signal transition-colors group-hover:text-signal-ink">
                    View on GitHub {'\u2197'}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
