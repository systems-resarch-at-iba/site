import { describe, expect, it } from 'vitest'
import { renderMarkdown, estimateReadingMinutes } from '../../lib/markdown'

describe('renderMarkdown', () => {
  it('renders basic markdown to HTML', () => {
    const { html } = renderMarkdown('Hello **world**.')
    expect(html).toContain('<strong>world</strong>')
  })

  it('assigns a stable heading-N id to headings that lack one', () => {
    const { html, toc } = renderMarkdown('## First Heading\n\ncontent\n\n### Second Heading')
    expect(toc).toEqual([
      { id: 'heading-1', level: 2, text: 'First Heading' },
      { id: 'heading-2', level: 3, text: 'Second Heading' },
    ])
    expect(html).toContain('<h2 id="heading-1">')
    expect(html).toContain('<h3 id="heading-2">')
  })

  it('does not add h1 to the table of contents', () => {
    const { toc } = renderMarkdown('# Title\n\n## Subheading')
    expect(toc).toHaveLength(1)
    expect(toc[0].level).toBe(2)
  })

  it('strips inline formatting from toc text but keeps it in the rendered heading', () => {
    const { html, toc } = renderMarkdown('## Some **bold** heading')
    expect(toc[0].text).toBe('Some bold heading')
    expect(html).toContain('<strong>bold</strong>')
  })

  it('preserves an existing heading id instead of overwriting it', () => {
    const { html, toc } = renderMarkdown('<h2 id="custom-id">Custom</h2>')
    expect(toc[0].id).toBe('custom-id')
    expect(html).toContain('id="custom-id"')
  })
})

describe('estimateReadingMinutes', () => {
  it('rounds to the nearest minute at ~200wpm', () => {
    const words = Array(400).fill('word').join(' ')
    expect(estimateReadingMinutes(words)).toBe(2)
  })

  it('never returns less than 1 minute, even for very short posts', () => {
    expect(estimateReadingMinutes('one two three')).toBe(1)
    expect(estimateReadingMinutes('')).toBe(1)
  })
})
