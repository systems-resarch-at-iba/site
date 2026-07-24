import Link from 'next/link'
import { PersonAvatar } from '../ui/person-avatar'
import type { AuthorRef } from '@/lib/types'

export function AuthorBlock({ author }: { author: AuthorRef }) {
  return (
    <div className="flex items-start gap-4 rounded-md border border-hairline bg-paper-raised p-6">
      <PersonAvatar size={48} src={author.avatar} alt={author.name} />
      <div className="min-w-0">
        <p className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-faint">
          Written by
        </p>
        <p className="mt-1 font-display text-base font-semibold text-ink">{author.name}</p>
        <p className="mt-1 font-serif text-sm text-ink-muted">{author.bio}</p>
        <div className="mt-3 flex items-center gap-4 font-sans text-sm">
          {author.github && (
            <a
              href={author.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-signal transition-colors hover:text-signal-ink"
            >
              GitHub {'\u2197'}
            </a>
          )}
          <Link href="/blog" className="text-signal transition-colors hover:text-signal-ink">
            More posts &rarr;
          </Link>
        </div>
      </div>
    </div>
  )
}
