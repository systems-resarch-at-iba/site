'use client'

import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
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

/**
 * Scrolls to a heading and records it in the address bar without adding a history entry, so the
 * back button leaves the post instead of stepping through every section that was clicked.
 * Smooth scrolling is skipped when the visitor prefers reduced motion.
 */
function jumpTo(event: MouseEvent<HTMLAnchorElement>, id: string) {
  const target = document.getElementById(id)
  if (!target) return

  event.preventDefault()
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
  window.history.replaceState(window.history.state, '', `#${id}`)
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
    <ul
      ref={listRef}
      className={
        scrollable ? 'no-scrollbar min-h-0 space-y-[0.6rem] overflow-y-auto' : 'space-y-[0.6rem]'
      }
    >
      {items.map((item) => (
        <li key={item.id}>
          <a
            href={`#${item.id}`}
            data-active={activeId === item.id}
            onClick={(e) => jumpTo(e, item.id)}
            className={`
              block font-sans text-[0.8125rem] leading-snug transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2
              ${item.level === 3 ? 'ml-3' : ''}
              ${
                activeId === item.id
                  ? 'font-medium text-signal'
                  : 'text-ink-muted hover:text-ink hover:underline'
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
 * sticky list that sits against the right edge of the grid and highlights the
 * section being read, meant for the right grid column at lg+. `variant="mobile"` is a collapsible disclosure meant to
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
        <summary className="cursor-pointer font-sans text-sm font-semibold text-ink">
          On this page
        </summary>
        <div className="mt-3">
          <TocList items={items} activeId={activeId} />
        </div>
      </details>
    )
  }

  return (
    <nav aria-label="On this page" className="hidden h-full w-full max-w-64 lg:ml-auto lg:block">
      <div className="sticky top-24 flex max-h-[calc(100vh-8rem)] flex-col">
        <h3 className="mb-4 shrink-0 border-b border-hairline pb-2.5 font-sans text-sm font-semibold text-ink">
          On this page
        </h3>
        <TocList items={items} activeId={activeId} scrollable />
      </div>
    </nav>
  )
}
