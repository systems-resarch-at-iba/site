'use client'

import { useEffect, useState } from 'react'
import { THEMES, applyTheme } from '@/lib/themes'

const STORAGE_KEY = 'theme'

/**
 * Floating theme switcher: lets visitors pick a light or dark palette.
 * Bottom-left so it doesn't collide with the floating nav.
 */
export function ThemeSwitcher() {
  const [open, setOpen] = useState(false)
  // Always starts on THEMES[0] so the server-rendered HTML and the client's
  // first (hydration) render match exactly. The persisted choice, which
  // only exists in the browser, is read and applied after mount instead,
  // never during the render that has to match SSR output.
  const [activeId, setActiveId] = useState<string>(THEMES[0].id)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    const theme = THEMES.find((t) => t.id === saved)
    if (theme) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, a browser-only store; must happen post-mount, not during the SSR-matching render
      setActiveId(theme.id)
      applyTheme(theme)
    }
  }, [])

  const select = (id: string) => {
    const theme = THEMES.find((t) => t.id === id)
    if (!theme) return
    setActiveId(id)
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, id)
  }

  const lightThemes = THEMES.filter((t) => t.mode === 'light')
  const darkThemes = THEMES.filter((t) => t.mode === 'dark')

  return (
    <div className="fixed bottom-4 left-4 z-[100] font-sans text-sm">
      {open && (
        <div className="mb-2 w-56 max-w-[calc(100vw-2rem)] rounded-md border border-hairline bg-paper-raised p-3 shadow-nav">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
            Light
          </p>
          <div className="mb-3 flex flex-col gap-1">
            {lightThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => select(theme.id)}
                className={`flex items-center gap-2 rounded-sm px-2 py-1.5 text-left transition-colors cursor-pointer ${
                  activeId === theme.id ? 'bg-signal-dim text-signal-ink' : 'text-ink hover:bg-paper'
                }`}
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full border border-hairline-strong"
                  style={{ backgroundColor: theme.tokens.signal }}
                />
                {theme.label}
              </button>
            ))}
          </div>

          <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
            Dark
          </p>
          <div className="flex flex-col gap-1">
            {darkThemes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => select(theme.id)}
                className={`flex items-center gap-2 rounded-sm px-2 py-1.5 text-left transition-colors cursor-pointer ${
                  activeId === theme.id ? 'bg-signal-dim text-signal-ink' : 'text-ink hover:bg-paper'
                }`}
              >
                <span
                  className="h-3 w-3 shrink-0 rounded-full border border-hairline-strong"
                  style={{ backgroundColor: theme.tokens.signal }}
                />
                {theme.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="flex max-w-[calc(100vw-2rem)] items-center gap-2 rounded-full border border-hairline bg-paper-raised px-4 py-2 font-medium text-ink shadow-nav transition-colors hover:border-hairline-strong cursor-pointer"
      >
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-signal" aria-hidden="true" />
        <span className="truncate">
          Theme: {THEMES.find((t) => t.id === activeId)?.label}
        </span>
      </button>
    </div>
  )
}
