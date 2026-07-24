// Conventional per-language colors (GitHub's linguist palette), desaturated
// so the project-grid language dots don't fight the paper/ink palette.
export const LANGUAGE_COLORS: Record<string, string> = {
  Rust: '#c9967a',
  Python: '#5b84a8',
  C: '#8a8a8a',
  'C++': '#c97a94',
  TypeScript: '#6d92b8',
  JavaScript: '#cfc27a',
  Go: '#5fa8b8',
  Shell: '#8fb87a',
  Assembly: '#a68a5c',
  TeX: '#7a9463',
  'Jupyter Notebook': '#c98a5b',
}

export function languageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? '#9498A2' // falls back to ink-faint
}
