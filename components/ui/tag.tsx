interface TagProps {
  label: string
  className?: string
}

/** Static chip: post tags on the article page. Not interactive; see TabRow for filters. */
export function Tag({ label, className = '' }: TagProps) {
  return (
    <span
      className={`inline-block font-sans text-[11px] font-medium uppercase tracking-wide px-3 py-1.5 rounded-sm bg-signal-dim text-signal-ink ${className}`}
    >
      {label}
    </span>
  )
}
