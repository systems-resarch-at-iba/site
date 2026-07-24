import Link from 'next/link'
import type { Post } from '@/lib/types'

export function PostNav({ prev, next }: { prev: Post | null; next: Post | null }) {
  if (!prev && !next) return null

  return (
    <nav
      aria-label="More posts"
      className="mt-12 grid grid-cols-1 gap-4 border-t border-hairline pt-8 sm:grid-cols-2"
    >
      <div>
        {prev && (
          <Link
            href={`/blog/${prev.slug}`}
            className="group block rounded-md border border-hairline bg-paper-raised p-4 transition-colors hover:border-hairline-strong"
          >
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-faint">
              &larr; Previous
            </span>
            <p className="mt-1 font-display text-sm font-semibold text-ink group-hover:text-signal">
              {prev.title}
            </p>
          </Link>
        )}
      </div>
      <div className="sm:text-right">
        {next && (
          <Link
            href={`/blog/${next.slug}`}
            className="group block rounded-md border border-hairline bg-paper-raised p-4 transition-colors hover:border-hairline-strong"
          >
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-faint">
              Next &rarr;
            </span>
            <p className="mt-1 font-display text-sm font-semibold text-ink group-hover:text-signal">
              {next.title}
            </p>
          </Link>
        )}
      </div>
    </nav>
  )
}
