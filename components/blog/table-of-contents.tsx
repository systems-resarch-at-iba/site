'use client'

import { useEffect, useRef, useState } from 'react'
import type { TocItem } from '@/lib/markdown'

/**
 * The heading above 25% of the viewport height that is closest to it. Computed on every scroll,
 * so a fast jump through the post still lands on the right entry.
 */
function useScrollSpy(items: TocItem[]) {
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    if (items.length === 0) return

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null)
    if (headings.length === 0) return

    const update = () => {
      const line = window.innerHeight * 0.25
      let current = headings[0]
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading
        else break
      }
      setActiveId(current.id)
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [items])

  return activeId
}

function TocList({
  items,
  activeId,
  scrollable = false,
}: {
  items: TocItem[]
  activeId: string
  scrollable?: boolean
}) {
  const listRef = useRef<HTMLUListElement>(null)

  // Keeps the active entry inside the list when the list is taller than the space it has.
  useEffect(() => {
    const list = listRef.current
    const active = list?.querySelector<HTMLElement>('[data-active="true"]')
    if (!list || !active) return

    const margin = 16
    const listBox = list.getBoundingClientRect()
    const activeBox = active.getBoundingClientRect()
    if (activeBox.top - margin < listBox.top) {
      list.scrollBy({ top: activeBox.top - margin - listBox.top, behavior: 'smooth' })
    } else if (activeBox.bottom + margin > listBox.bottom) {
      list.scrollBy({ top: activeBox.bottom + margin - listBox.bottom, behavior: 'smooth' })
    }
  }, [activeId])

  return (
    <ul ref={listRef} className={scrollable ? 'no-scrollbar min-h-0 space-y-2 overflow-y-auto' : 'space-y-2'}>
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            data-active={activeId === item.id}
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
    <nav aria-label="On this page" className="hidden h-full lg:block">
      <div className="sticky top-24 flex max-h-[calc(100vh-8rem)] flex-col">
        <h3 className="mb-3 shrink-0 border-b border-hairline pb-3 font-sans text-xs font-semibold uppercase tracking-widest text-ink-muted">
          On this page
        </h3>
        <TocList items={items} activeId={activeId} scrollable />
      </div>
    </nav>
  )
}
