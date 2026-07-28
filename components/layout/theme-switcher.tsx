'use client'

import { useEffect, useRef, useState } from 'react'
import { THEMES, applyTheme } from '@/lib/themes'

const STORAGE_KEY = 'theme'
const LABEL_DURATION_MS = 2000

const MODE_LABEL: Record<'light' | 'dark', string> = { light: 'Light', dark: 'Dark' }

/**
 * Floating theme switcher: lets visitors pick a light or dark palette.
 * Bottom-left so it doesn't collide with the floating nav.
 *
 * Rests as a plain circular button (just the accent dot) so it stays out
 * of the way most of the time; picking a theme briefly expands it to show
 * "Theme: Light/Dark" as confirmation, then it collapses back to the
 * circle on its own after a couple seconds. Only two themes exist (light
 * and dark, both teal-accented -- see lib/themes.ts), so this is a plain
 * two-option toggle, not a grouped list of theme variants.
 */
export function ThemeSwitcher() {
  const [open, setOpen] = useState(false)
  // Always starts on THEMES[0] so the server-rendered HTML and the client's
  // first (hydration) render match exactly. The persisted choice, which
  // only exists in the browser, is read and applied after mount instead,
  // never during the render that has to match SSR output.
  const [activeId, setActiveId] = useState<string>(THEMES[0].id)
  const [showLabel, setShowLabel] = useState(false)
  const labelTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const theme = THEMES.find((t) => t.id === saved)
    if (theme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, a browser-only store; must happen post-mount, not during the SSR-matching render
      setActiveId(theme.id)
      applyTheme(theme)
    }
    return () => {
      if (labelTimeout.current) clearTimeout(labelTimeout.current)
    }
  }, [])

  const select = (id: string) => {
    const theme = THEMES.find((t) => t.id === id)
    if (!theme) return
    setActiveId(id)
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, id)
    setOpen(false)

    setShowLabel(true)
    if (labelTimeout.current) clearTimeout(labelTimeout.current)
    labelTimeout.current = setTimeout(() => setShowLabel(false), LABEL_DURATION_MS)
  }

  const activeTheme = THEMES.find((t) => t.id === activeId) ?? THEMES[0]

  return (
    <div className="fixed bottom-4 left-4 z-[100] font-sans text-sm">
      {open && (
        <div className="mb-2 w-32 rounded-md border border-hairline bg-paper-raised p-1 shadow-nav">
          {THEMES.map((theme) => (
            <button
              key={theme.id}
              onClick={() => select(theme.id)}
              className={`flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left transition-colors cursor-pointer ${
                activeId === theme.id ? 'bg-signal-dim text-signal-ink' : 'text-ink hover:bg-paper'
              }`}
            >
              <span
                className="h-3 w-3 shrink-0 rounded-full border border-hairline-strong"
                style={{ backgroundColor: theme.tokens.signal }}
              />
              {MODE_LABEL[theme.mode]}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change theme"
        // Fixed pixel widths in both states (not w-auto/content-sized) are
        // what make this animatable at all -- CSS can't interpolate to/from
        // "auto," only between two known values. Left padding stays
        // identical either way so the dot never moves; only the width (and
        // therefore the right edge, since this button is left-anchored)
        // actually transitions, which reads as the right side collapsing
        // inward rather than the whole button resizing around its center.
        className={`flex h-11 items-center gap-2 overflow-hidden rounded-full border border-hairline bg-paper-raised pl-[17px] text-ink shadow-nav transition-[width] duration-300 ease-out hover:border-hairline-strong cursor-pointer ${
          showLabel ? 'w-40 pr-4 font-medium' : 'w-11 pr-0'
        }`}
      >
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
        {showLabel && <span className="truncate">Theme: {MODE_LABEL[activeTheme.mode]}</span>}
      </button>
    </div>
  )
}
