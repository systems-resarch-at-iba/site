'use client'

import { useEffect } from 'react'

const COPY_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
const CHECK_ICON =
  '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'

/**
 * Injects a copy-to-clipboard button into each code block inside .post-body:
 * a copy icon top-right that swaps to a checkmark for 1.5s on click. Runs
 * client-side against the server-rendered markdown output, since the body
 * itself is static HTML.
 *
 * Each <pre> gets wrapped in a plain (non-scrolling) div that the button is
 * appended to instead of <pre> itself. <pre> is the one with overflow-x:
 * auto for long lines; if the button were a child of that scrolling element,
 * it would scroll along with the code instead of staying pinned to the
 * corner (see .code-block-wrapper in globals.css).
 */
export function CodeBlockEnhancer() {
  useEffect(() => {
    const blocks = document.querySelectorAll<HTMLPreElement>(
      '.post-body pre:not([data-enhanced])'
    )

    blocks.forEach((pre) => {
      pre.dataset.enhanced = 'true'
      const code = pre.querySelector('code')
      if (!code) return

      const wrapper = document.createElement('div')
      wrapper.className = 'code-block-wrapper'
      pre.parentNode?.insertBefore(wrapper, pre)
      wrapper.appendChild(pre)

      const button = document.createElement('button')
      button.type = 'button'
      button.setAttribute('aria-label', 'Copy code')
      button.className =
        'absolute top-2 right-2 cursor-pointer rounded-sm border border-hairline bg-paper-raised p-1.5 text-ink-faint transition-colors hover:text-signal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2'
      button.innerHTML = COPY_ICON

      button.addEventListener('click', async () => {
        await navigator.clipboard.writeText(code.textContent ?? '')
        button.innerHTML = CHECK_ICON
        setTimeout(() => {
          button.innerHTML = COPY_ICON
        }, 1500)
      })

      wrapper.appendChild(button)
    })
  }, [])

  return null
}
