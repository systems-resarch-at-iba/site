import Link from 'next/link'

const GITHUB_ORG = 'https://github.com/systems-resarch-at-iba'

// Set at build time in next.config.ts (via git rev-parse, or the host's own
// commit-sha env var if set): a quiet "systems" flourish that's actually the
// build's commit, not just decorative.
const COMMIT_SHA = process.env.NEXT_PUBLIC_COMMIT_SHA ?? 'unknown'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-16 border-t border-hairline bg-paper py-12">
      <div className="mx-auto max-w-[1120px] px-6">
        <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="mb-2 font-display font-bold text-ink">IBA</div>
            <p className="font-serif text-sm text-ink-muted">
              Systems Research: advancing the design and implementation of
              systems for the next generation of computing.
            </p>
          </div>

          <div>
            <div className="mb-3 font-sans text-sm font-semibold text-ink">Links</div>
            <div className="space-y-2">
              {[
                { label: 'Blog', href: '/blog' },
                { label: 'Projects', href: '/projects' },
                { label: 'People', href: '/people' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block font-sans text-sm text-ink-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-3 font-sans text-sm font-semibold text-ink">Connect</div>
            <div className="space-y-2">
              <a
                href={GITHUB_ORG}
                target="_blank"
                rel="noopener noreferrer"
                className="block font-sans text-sm text-ink-muted transition-colors hover:text-signal"
              >
                GitHub &rarr;
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-xs text-ink-faint">
            &copy; {currentYear} Systems Research @ IBA. All rights reserved.
          </p>
          <p className="font-mono text-xs text-ink-faint">
            build {COMMIT_SHA.slice(0, 7)}
          </p>
        </div>
      </div>
    </footer>
  )
}
