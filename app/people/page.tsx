import type { Metadata } from 'next'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { PersonAvatar } from '@/components/ui/person-avatar'
import { CONTRIBUTORS } from '@/lib/data'

export const metadata: Metadata = { title: 'People' }

export default function PeoplePage() {
  const lead = CONTRIBUTORS.find((p) => p.tier === 'lead')
  const core = CONTRIBUTORS.filter((p) => p.tier === 'core')
  const contributors = CONTRIBUTORS.filter((p) => p.tier === 'contributor')

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <section className="mx-auto max-w-[1120px] px-6 pb-8 pt-16 md:pt-20">
          <h1 className="mb-4 font-display text-[clamp(32px,5.5vw,56px)] font-bold text-ink">
            People
          </h1>
          <p className="max-w-xl font-serif text-base text-ink-muted">
            The people behind the group&rsquo;s research and writing.
          </p>
        </section>

        {/* Lead */}
        {lead && (
          <section className="mx-auto max-w-[1120px] border-t border-hairline px-6 py-14">
            <div className="flex flex-col gap-10 sm:flex-row sm:items-start">
              <PersonAvatar size={160} src={lead.avatar} alt={lead.name} />
              <div className="min-w-0">
                <h2 className="mb-1.5 font-display text-[28px] font-semibold text-ink">
                  {lead.name}
                </h2>
                <p className="mb-5 font-sans text-sm font-medium text-ink-muted">{lead.role}</p>
                {lead.bio && (
                  <p className="mb-6 max-w-2xl font-serif text-base leading-relaxed text-ink-muted">
                    {lead.bio}
                  </p>
                )}
                <div className="flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm">
                  {lead.links?.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      className="text-signal transition-colors hover:text-signal-ink hover:underline"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Core team */}
        {core.length > 0 && (
          <section className="mx-auto max-w-[1120px] border-t border-hairline px-6 py-14">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {core.map((person) => (
                <div key={person.slug} className="flex flex-col items-center text-center">
                  <PersonAvatar size={96} className="mb-4" src={person.avatar} alt={person.name} />
                  <h3 className="mb-0.5 font-display text-lg font-semibold text-ink">
                    {person.name}
                  </h3>
                  <p className="mb-2 font-sans text-[13px] font-medium text-ink-muted">
                    {person.role}
                  </p>
                  {person.bio && (
                    <p className="mb-2 max-w-xs font-serif text-sm text-ink-muted">{person.bio}</p>
                  )}
                  {person.links?.[0] && (
                    <a
                      href={person.links[0].url}
                      className="font-sans text-sm text-signal transition-colors hover:text-signal-ink"
                    >
                      {person.links[0].label} {'\u2197'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Contributors */}
        {contributors.length > 0 && (
          <section className="mx-auto max-w-[1120px] border-t border-hairline px-6 py-14">
            <h2 className="mb-8 font-display text-2xl font-semibold text-ink">Contributors</h2>
            {/* flex + explicit per-item width (not CSS grid) so a partial
                last row centers instead of hugging the left edge. With
                only 4 contributors today, a 2-up mobile grid would strand
                the fourth one alone on the left otherwise. */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-8">
              {contributors.map((person) => {
                const link = person.links?.[0]
                const cardClassName =
                  'flex w-[calc(50%-12px)] flex-col items-center text-center sm:w-[calc(33.333%-16px)] lg:w-[calc(20%-19.2px)]'
                const inner = (
                  <>
                    <PersonAvatar size={56} className="mb-3" src={person.avatar} alt={person.name} />
                    <p className="font-sans text-sm font-medium text-ink transition-colors group-hover:text-signal">
                      {person.name}
                    </p>
                    <p className="font-sans text-xs text-ink-faint">{person.role}</p>
                  </>
                )

                return link ? (
                  <a key={person.slug} href={link.url} className={`group ${cardClassName}`}>
                    {inner}
                  </a>
                ) : (
                  <div key={person.slug} className={cardClassName}>
                    {inner}
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
