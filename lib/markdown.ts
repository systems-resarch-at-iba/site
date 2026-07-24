import { marked } from 'marked'

export interface TocItem {
  id: string
  level: number
  text: string
}

export interface RenderedPost {
  html: string
  toc: TocItem[]
}

marked.setOptions({ gfm: true, breaks: false })

function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, '').trim()
}

/**
 * Renders markdown to HTML and builds the table of contents.
 *
 * Ports the same approach as blog/js/post.js on the personal site this
 * pipeline is modeled on: render with `marked`, then walk the headings and
 * assign a stable `heading-N` id to any that lack one. The difference is
 * this runs server-side at build time (over h2/h3, since h1 is the page
 * title rendered outside the markdown body) instead of client-side over the
 * DOM after a runtime fetch.
 */
export function renderMarkdown(markdown: string): RenderedPost {
  const rawHtml = marked.parse(markdown, { async: false }) as string
  const toc: TocItem[] = []
  let idx = 0

  const html = rawHtml.replace(
    /<h([23])(?:\s+id="([^"]*)")?([^>]*)>([\s\S]*?)<\/h\1>/g,
    (_match, levelStr: string, existingId: string | undefined, rest: string, inner: string) => {
      const level = parseInt(levelStr, 10)
      const text = stripTags(inner)
      let id = existingId
      if (!id) {
        idx += 1
        id = `heading-${idx}`
      }
      toc.push({ id, level, text })
      return `<h${level} id="${id}"${rest}>${inner}</h${level}>`
    }
  )

  return { html, toc }
}

/** ~200 wpm, computed from body word count. */
export function estimateReadingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
