'use client'

import { useEffect, useState } from 'react'
import type { TocItem } from '@/lib/markdown'

function useScrollSpy(items: TocItem[]) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (items.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        })
      },
      { rootMargin: '-20% 0% -70% 0%' }
    )

    items.forEach((item) => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [items])

  return activeId
}

function TocList({ items, activeId }: { items: TocItem[]; activeId: string }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
            }}
            className={`
              block border-l-2 py-0.5 pl-3 font-sans text-sm transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2
              ${item.level === 3 ? 'ml-3 font-normal' : 'font-medium'}
              ${
                activeId === item.id
                  ? 'border-signal text-signal'
                  : 'border-transparent text-ink-muted hover:text-ink'
              }
            `}
          >
            {item.text}
          </a>
        </li>
      ))}
    </ul>
  )
}

interface TableOfContentsProps {
  items: TocItem[]
  variant: 'desktop' | 'mobile'
}

/**
 * Right-rail "On this page". `variant="desktop"` is a
 * sticky rail with a scroll-spy left border, meant for the right grid
 * column at lg+. `variant="mobile"` is a collapsible disclosure meant to
 * sit inline under the title on tablet/mobile, never a floating overlay.
 * Callers render whichever variant fits their layout slot and hide the
 * other with a breakpoint class, since the two live in different places in
 * the DOM (aside column vs. inline in the article flow).
 */
export function TableOfContents({ items, variant }: TableOfContentsProps) {
  const activeId = useScrollSpy(items)

  if (items.length === 0) return null

  if (variant === 'mobile') {
    return (
      <details className="mb-8 rounded-md border border-hairline bg-paper-raised p-4 lg:hidden">
        <summary className="cursor-pointer font-sans text-xs font-semibold uppercase tracking-widest text-ink-muted">
          On this page
        </summary>
        <div className="mt-3">
          <TocList items={items} activeId={activeId} />
        </div>
      </details>
    )
  }

  return (
    <nav aria-label="On this page" className="hidden lg:block">
      <div className="sticky top-24">
        <h3 className="mb-3 border-b border-hairline pb-3 font-sans text-xs font-semibold uppercase tracking-widest text-ink-muted">
          On this page
        </h3>
        <TocList items={items} activeId={activeId} />
      </div>
    </nav>
  )
}
