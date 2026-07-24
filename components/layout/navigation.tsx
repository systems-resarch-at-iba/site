'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GitHubIcon } from '../ui/icons'

const NAV_LINKS = [
  { label: 'Blog', href: '/blog' },
  { label: 'Projects', href: '/projects' },
  { label: 'People', href: '/people' },
]

/**
 * Floating, centered pill nav: inset from the viewport edges with a soft
 * shadow and a glass blur, sitting above the ambient dot-grid. A 3-column
 * grid (not justify-between) so the link group sits at the true visual
 * center regardless of how wide the wordmark or CTA are.
 */
export function Navigation() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <div className="sticky top-3 z-50 flex justify-center px-3 sm:top-4 sm:px-4">
      <nav className="grid w-full max-w-3xl grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-full bg-paper-raised/60 py-2 pl-4 pr-2 shadow-[0_8px_20px_-4px_rgba(0,0,0,0.12)] backdrop-blur-lg sm:gap-4 sm:pl-5">
        <Link
          href="/"
          className="justify-self-start truncate font-display text-[15px] font-bold tracking-tight text-ink transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2"
        >
          <span className="sm:hidden">SR@IBA</span>
          <span className="hidden sm:inline">Systems Research @ IBA</span>
        </Link>

        <div className="flex items-center justify-self-center gap-2 sm:gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap font-sans text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 ${
                isActive(link.href) ? 'text-signal' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <a
          href="https://github.com/systems-resarch-at-iba"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          className={`
            flex h-9 w-9 shrink-0 items-center justify-center justify-self-end
            rounded-full text-ink transition-colors
            hover:text-signal
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2
            sm:h-auto sm:w-auto sm:gap-1.5 sm:bg-ink sm:px-4 sm:py-2
            sm:font-sans sm:text-sm sm:font-medium sm:text-paper
            sm:hover:bg-signal sm:hover:text-paper
          `}
        >
          <GitHubIcon className="h-8 w-8 sm:hidden" />
          <span className="hidden sm:inline">GitHub {'\u2197'}</span>
        </a>
      </nav>
    </div>
  )
}
