import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'

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
// $inline$ and $$block$$ math, rendered to static HTML/MathML at build time
// via KaTeX (no client-side JS needed to display it). A malformed formula
// renders as an inline error message instead of throwing and failing the
// whole page.
marked.use(markedKatex({ throwOnError: false }))

function stripTags(html: string) {
  return html.replace(/<[^>]+>/g, '').trim()
}

// Reverses marked's own escaping (&, <, >, ", ' only) for TOC heading text,
// which gets rendered as plain text (not HTML) in the sidebar, so a literal
// "&quot;" would otherwise show up as-is instead of decoding to a quote mark.
// Order matters: decode the entities that can't produce a new "&" first,
// then "&amp;" last, so a heading that legitimately contains the literal
// text "&lt;" round-trips correctly instead of being decoded twice.
function decodeEntities(text: string) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
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
      const text = decodeEntities(stripTags(inner))
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
