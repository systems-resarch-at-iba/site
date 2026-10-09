import Link from 'next/link'
import { PersonAvatar } from '../ui/person-avatar'
import type { AuthorRef } from '@/lib/types'

/**
 * The first author in full, then the co-authors in one short row of chips: a small avatar and a
 * name each, linking to the person's profile when they have one.
 */
export function AuthorBlock({
  author,
  coAuthors = [],
}: {
  author: AuthorRef
  coAuthors?: AuthorRef[]
}) {
  return (
    <div className="rounded-md border border-hairline bg-paper-raised p-6">
      <div className="flex items-start gap-4">
        <PersonAvatar size={48} src={author.avatar} alt={author.name} />
        <div className="min-w-0">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-faint">
            Written by
          </p>
          <p className="mt-1 font-display text-base font-semibold text-ink">{author.name}</p>
          <p className="mt-1 font-serif text-sm text-ink-muted">{author.bio}</p>
          <div className="mt-3 flex items-center gap-4 font-sans text-sm">
            {author.link && (
              <a
                href={author.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal transition-colors hover:text-signal-ink"
              >
                {author.link.label} {'↗'}
              </a>
            )}
            <Link href="/blog" className="text-signal transition-colors hover:text-signal-ink">
              More posts &rarr;
            </Link>
          </div>
        </div>
      </div>

      {coAuthors.length > 0 && (
        <div className="mt-5 border-t border-hairline pt-4">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-faint">
            With
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {coAuthors.map((coAuthor) => {
              const chip = (
                <>
                  <PersonAvatar size={24} src={coAuthor.avatar} alt="" />
                  {coAuthor.name}
                </>
              )
              const className =
                'inline-flex items-center gap-2 rounded-full border border-hairline py-1 pl-1 pr-3 font-sans text-sm text-ink'
              return coAuthor.link ? (
                <a
                  key={coAuthor.slug}
                  href={coAuthor.link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${coAuthor.name}, ${coAuthor.link.label}`}
                  className={`${className} transition-colors hover:border-signal hover:text-signal`}
                >
                  {chip}
                </a>
              ) : (
                <span key={coAuthor.slug} className={className}>
                  {chip}
                </span>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
