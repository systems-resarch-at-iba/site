import type { Metadata } from 'next'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { PersonAvatar } from '@/components/ui/person-avatar'
import { getContributor } from '@/lib/data'
import { OthelloBoard } from '@othello/frontend'

export const metadata: Metadata = { title: 'Othello' }

const OTHELLO_AUTHOR_SLUGS = ['syed-taha', 'hamna-sajid', 'hadiya-muneeb']

export default function OthelloPlaygroundPage() {
  const people = OTHELLO_AUTHOR_SLUGS.map(getContributor).filter((p) => p !== undefined)

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <section className="mx-auto max-w-[1120px] px-6 py-12">
          <h1 className="mb-4 font-display text-[clamp(32px,5.5vw,56px)] font-bold text-ink">
            Othello
          </h1>
          <p className="font-serif text-base text-ink-muted">
            An MCTS + CNN Othello engine, AlphaZero-style. Play against it below.
          </p>
        </section>

        <OthelloBoard apiBaseUrl={process.env.NEXT_PUBLIC_OTHELLO_API_URL ?? 'http://localhost:8000'} />

        <section className="mx-auto max-w-[900px] px-6 py-14">
          <h2 className="mb-3 font-display text-2xl font-semibold text-ink">About the engine</h2>
          <p className="mb-4 font-serif text-base leading-relaxed text-ink-muted">
            Othello has far too many possible positions to search exhaustively, so this engine
            narrows the search the way AlphaZero does (Silver et al., 2018): Monte Carlo Tree
            Search (Browne et al., 2012) explores a handful of promising lines instead of every
            line, guided by a neural network that looks at a position and predicts two things,
            which moves look worth exploring and who&apos;s likely winning. The search spends more
            time on lines the network rates highly, the same way a strong player prunes bad
            options instinctively before calculating deeply into good ones.
          </p>
          <p className="mb-8 font-serif text-base leading-relaxed text-ink-muted">
            The network was trained entirely through self-play, no human games involved: it plays
            against itself repeatedly, and each game becomes training data for a slightly
            stronger version. The settings panel controls the search directly &mdash;{' '}
            <strong>MCTS simulations</strong> is how many lines it explores before committing to a
            move, <strong>c_puct value</strong> and <strong>c_puct scaling</strong> control how
            much it favors exploring new ideas over trusting what it already knows &mdash;{' '}
            <strong>move hints</strong> marks every square you&apos;re legally allowed to play, and{' '}
            <strong>AI hints</strong> shades those squares by how strongly the AI recommends each
            one. A full technical write-up, covering the board representation, network
            architecture, and training loop, is coming to the blog.
          </p>

          <h3 className="mb-3 font-display text-lg font-semibold text-ink">References</h3>
          <ol className="list-decimal space-y-3 pl-5 font-serif text-base text-ink-muted marker:text-ink-faint">
            <li>
              Taha, S.{' '}
              <em>othello-engine</em> [Source code]. GitHub.{' '}
              <a
                href="https://github.com/syedtaha22/othello-engine"
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal transition-colors hover:text-signal-ink hover:underline"
              >
                https://github.com/syedtaha22/othello-engine
              </a>{' '}
              &mdash; the original engine, including the self-play training loop this
              deployment&apos;s network was produced by.
            </li>
            <li>
              Browne, C. B., Powley, E., Whitehouse, D., Lucas, S. M., Cowling, P. I.,
              Rohlfshagen, P., Tavener, S., Perez, D., Samothrakis, S., &amp; Colton, S. (2012). A
              survey of Monte Carlo tree search methods.{' '}
              <em>IEEE Transactions on Computational Intelligence and AI in Games</em>, 4(1),
              1&ndash;43.{' '}
              <a
                href="https://doi.org/10.1109/TCIAIG.2012.2186810"
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal transition-colors hover:text-signal-ink hover:underline"
              >
                doi:10.1109/TCIAIG.2012.2186810
              </a>
            </li>
            <li>
              Silver, D., Hubert, T., Schrittwieser, J., et al. (2018). A general reinforcement
              learning algorithm that masters chess, shogi, and Go through self-play.{' '}
              <em>Science</em>, 362, 1140&ndash;1144.{' '}
              <a
                href="https://doi.org/10.1126/science.aar6404"
                target="_blank"
                rel="noopener noreferrer"
                className="text-signal transition-colors hover:text-signal-ink hover:underline"
              >
                doi:10.1126/science.aar6404
              </a>
            </li>
          </ol>
        </section>

        <section className="mx-auto max-w-[900px] border-t border-hairline px-6 py-14">
          <h2 className="mb-6 font-display text-2xl font-semibold text-ink">People</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {people.map((person) => (
              <div
                key={person.slug}
                className="flex items-start gap-4 rounded-md border border-hairline bg-paper-raised p-6"
              >
                <PersonAvatar size={48} src={person.avatar} alt={person.name} />
                <div className="min-w-0">
                  <p className="font-display text-base font-semibold text-ink">{person.name}</p>
                  {person.role && (
                    <p className="mt-1 font-sans text-sm text-ink-muted">{person.role}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
