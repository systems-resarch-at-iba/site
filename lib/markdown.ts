import { marked } from 'marked'
import markedKatex from 'marked-katex-extension'
import { getSingletonHighlighter, type BundledLanguage } from 'shiki'

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

// Highlighted at build time (server-side, once per post) rather than
// client-side: no extra JS shipped to the browser, no flash of unstyled
// code. `defaultColor: false` makes shiki emit --shiki-light/--shiki-dark
// CSS variables per token instead of baking in one theme's colors, so the
// site's existing light/dark toggle (data-theme attribute) can pick between
// them -- see .post-body pre.shiki in globals.css.
const SHIKI_THEMES = { light: 'github-light', dark: 'github-dark' } as const
const PLAINTEXT_LANG = 'text'

let highlighter: Awaited<ReturnType<typeof getSingletonHighlighter>>

marked.use({
  renderer: {
    code({ text, lang }) {
      const language = lang?.split(/\s+/)[0]
      const resolvedLang = language && highlighter.getLoadedLanguages().includes(language)
        ? language
        : PLAINTEXT_LANG
      return highlighter.codeToHtml(text, {
        lang: resolvedLang,
        themes: SHIKI_THEMES,
        defaultColor: false,
      })
    },
  },
})

// Fence languages not yet loaded into the shared highlighter throw on load
// (e.g. a typo, or a language that isn't a real Shiki grammar); those fall
// back to a plain, unhighlighted block above rather than failing the build.
async function ensureLanguagesLoaded(langs: string[]) {
  await Promise.all(
    langs.map(async (lang) => {
      try {
        await highlighter.loadLanguage(lang as BundledLanguage)
      } catch {
        // Falls back to PLAINTEXT_LANG in the renderer above.
      }
    })
  )
}

function fenceLanguages(markdown: string): string[] {
  const langs = new Set<string>()
  for (const match of markdown.matchAll(/^```\s*([\w-]+)/gm)) {
    langs.add(match[1])
  }
  return [...langs]
}

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
export async function renderMarkdown(markdown: string): Promise<RenderedPost> {
  highlighter ??= await getSingletonHighlighter({
    themes: Object.values(SHIKI_THEMES),
    langs: [],
  })
  await ensureLanguagesLoaded(fenceLanguages(markdown))

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
