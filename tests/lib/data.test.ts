import { describe, expect, it } from 'vitest'
import { CONTRIBUTORS, getContributor } from '../../lib/data'

describe('getContributor', () => {
  it('finds a contributor by slug', () => {
    const found = getContributor('syed-taha')
    expect(found?.name).toBe('Syed Taha')
  })

  it('returns undefined for an unknown slug', () => {
    expect(getContributor('does-not-exist')).toBeUndefined()
  })
})

describe('CONTRIBUTORS', () => {
  it('has exactly one lead', () => {
    expect(CONTRIBUTORS.filter((c) => c.tier === 'lead')).toHaveLength(1)
  })

  it('has unique slugs', () => {
    const slugs = CONTRIBUTORS.map((c) => c.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})
