'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GitHubIcon } from '../ui/icons'

const NAV_LINKS = [
  { label: 'Blog', href: '/blog' },
  { label: 'Projects', href: '/projects' },
  { label: 'Playground', href: '/playground' },
  { label: 'People', href: '/people' },
]

/**
 * Floating, centered pill nav: inset from the viewport edges with a soft
 * shadow and a glass blur, sitting above the ambient dot-grid. A 3-column
 * grid (not justify-between) so the link group sits at the true visual
 * center regardless of how wide the wordmark or CTA are.
 *
 * Below `sm`, the link group doesn't fit inline anymore (four labels plus
 * the wordmark and GitHub button), so it's replaced by a hamburger toggle
 * in the same grid slot, opening a stacked panel below the pill instead.
 */
export function Navigation() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname.startsWith(href)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="sticky top-3 z-50 flex justify-center px-3 sm:top-4 sm:px-4">
      <div className="w-full max-w-3xl">
        <nav className="grid w-full grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-full bg-paper-raised/60 py-2 pl-4 pr-2 shadow-nav backdrop-blur-lg sm:gap-4 sm:pl-5">
          <Link
            href="/"
            className="justify-self-start truncate font-display text-[15px] font-bold tracking-tight text-ink transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2"
          >
            <span className="sm:hidden">SR@IBA</span>
            <span className="hidden sm:inline">Systems Research @ IBA</span>
          </Link>

          <div className="hidden items-center justify-self-center gap-6 sm:flex">
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

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label="Toggle navigation menu"
            className="flex h-11 w-11 items-center justify-center justify-self-center rounded-full text-ink transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 sm:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="h-5 w-5"
              aria-hidden="true"
            >
              {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>

          <a
            href="https://github.com/systems-resarch-at-iba"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className={`
              flex h-11 w-11 shrink-0 items-center justify-center justify-self-end
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

        {mobileOpen && (
          <div className="mt-2 rounded-md border border-hairline bg-paper-raised p-2 shadow-nav backdrop-blur-lg sm:hidden">
            <div className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-sm px-3 py-2.5 font-sans text-sm font-medium transition-colors ${
                    isActive(link.href) ? 'bg-signal-dim text-signal-ink' : 'text-ink hover:bg-paper'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
