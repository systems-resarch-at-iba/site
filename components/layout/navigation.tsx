'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BlogIcon, GitHubIcon, PeopleIcon, PlaygroundIcon, ProjectsIcon } from '../ui/icons'

const NAV_LINKS = [
  { label: 'Blog', href: '/blog', Icon: BlogIcon },
  { label: 'Projects', href: '/projects', Icon: ProjectsIcon },
  { label: 'Playground', href: '/playground', Icon: PlaygroundIcon },
  { label: 'People', href: '/people', Icon: PeopleIcon },
]

/**
 * Floating, centered pill nav: inset from the viewport edges with a soft
 * shadow and a glass blur, sitting above the ambient dot-grid. A 3-column
 * grid (not justify-between) so the link group sits at the true visual
 * center regardless of how wide the wordmark or CTA are.
 *
 * Below `sm`, the four labels plus the wordmark and GitHub button don't fit
 * inline anymore, so each link shrinks to an icon in the same grid slot.
 */
export function Navigation() {
  const pathname = usePathname()
  const isActive = (href: string) => pathname.startsWith(href)

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

          <div className="flex items-center justify-self-center gap-0.5 sm:hidden">
            {NAV_LINKS.map(({ label, href, Icon }) => (
              <Link
                key={href}
                href={href}
                aria-label={label}
                aria-current={isActive(href) ? 'page' : undefined}
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 ${
                  isActive(href) ? 'text-signal' : 'text-ink-muted hover:text-ink'
                }`}
              >
                <Icon className="h-5 w-5" />
              </Link>
            ))}
          </div>

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
      </div>
    </div>
  )
}
