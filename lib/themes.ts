export interface ThemeTokens {
  paper: string
  paperRaised: string
  ink: string
  inkMuted: string
  inkFaint: string
  hairline: string
  hairlineStrong: string
  signal: string
  signalDim: string
  signalInk: string
}

// The 3 background glow colors behind the hero. Precomputed once per theme
// (an analogous hue spread around each theme's signal color, tuned
// separately for light/dark contrast) rather than derived at runtime: with
// only 2 fixed themes, the math has exactly 2 possible outputs, so there's
// nothing to gain from recomputing it on every theme switch.
export interface AuroraPalette {
  c1: string
  c2: string
  c3: string
}

export interface Theme {
  id: string
  label: string
  mode: 'light' | 'dark'
  tokens: ThemeTokens
  aurora: AuroraPalette
}

// Maps ThemeTokens keys to the CSS custom properties declared in
// app/globals.css's @theme block.
export const TOKEN_CSS_VARS: Record<keyof ThemeTokens, string> = {
  paper: '--color-paper',
  paperRaised: '--color-paper-raised',
  ink: '--color-ink',
  inkMuted: '--color-ink-muted',
  inkFaint: '--color-ink-faint',
  hairline: '--color-hairline',
  hairlineStrong: '--color-hairline-strong',
  signal: '--color-signal',
  signalDim: '--color-signal-dim',
  signalInk: '--color-signal-ink',
}

const LIGHT_BASE = {
  paper: '#fafaf9',
  paperRaised: '#ffffff',
  ink: '#15161b',
  inkMuted: '#5b5e68',
  inkFaint: '#9498a2',
  hairline: '#e7e7e3',
  hairlineStrong: '#d4d4ce',
}

const DARK_BASE = {
  paper: '#101114',
  paperRaised: '#1a1b20',
  ink: '#f2f2f0',
  inkMuted: '#a3a6ad',
  inkFaint: '#6b6e76',
  hairline: '#2a2c33',
  hairlineStrong: '#3a3d46',
}

// Trimmed to the two the site actually uses (teal accent, light and dark)
// after indigo/violet/cyan were dropped as options entirely rather than
// just deprioritized.
export const THEMES: Theme[] = [
  {
    id: 'light-teal',
    label: 'Teal (current)',
    mode: 'light',
    tokens: { ...LIGHT_BASE, signal: '#0d9488', signalDim: '#f0fdfa', signalInk: '#0f766e' },
    aurora: {
      c1: 'hsl(174.7 72% 52% / 0.340)',
      c2: 'hsl(142.7 72% 52% / 0.289)',
      c3: 'hsl(206.7 72% 52% / 0.289)',
    },
  },
  {
    id: 'dark-teal',
    label: 'Teal',
    mode: 'dark',
    tokens: { ...DARK_BASE, signal: '#2dd4bf', signalDim: '#042f2e', signalInk: '#14b8a6' },
    aurora: {
      c1: 'hsl(172.5 75% 62% / 0.320)',
      c2: 'hsl(140.5 75% 62% / 0.272)',
      c3: 'hsl(204.5 75% 62% / 0.272)',
    },
  },
]

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  for (const [key, cssVar] of Object.entries(TOKEN_CSS_VARS) as [keyof ThemeTokens, string][]) {
    root.style.setProperty(cssVar, theme.tokens[key])
  }
  root.style.colorScheme = theme.mode
  root.dataset.theme = theme.mode

  // Swap the aurora glow to this theme's precomputed palette too, so
  // switching themes updates the landing page background, not just the
  // token colors.
  root.style.setProperty('--aurora-1', theme.aurora.c1)
  root.style.setProperty('--aurora-2', theme.aurora.c2)
  root.style.setProperty('--aurora-3', theme.aurora.c3)
}
