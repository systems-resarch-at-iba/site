import { describe, expect, it } from 'vitest'
import { languageColor, LANGUAGE_COLORS } from '../../lib/language-colors'

describe('languageColor', () => {
  it('returns the mapped color for a known language', () => {
    expect(languageColor('Rust')).toBe(LANGUAGE_COLORS.Rust)
    expect(languageColor('Python')).toBe(LANGUAGE_COLORS.Python)
  })

  it('falls back to ink-faint for an unmapped language', () => {
    expect(languageColor('COBOL')).toBe('#9498A2')
  })

  it('falls back to ink-faint for an empty string', () => {
    expect(languageColor('')).toBe('#9498A2')
  })

  it('is case-sensitive (matches GitHub API casing exactly)', () => {
    expect(languageColor('rust')).toBe('#9498A2')
  })
})
