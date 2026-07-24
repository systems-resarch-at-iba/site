'use client'

import { useState } from 'react'

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  className?: string
}

export function SearchInput({
  placeholder = 'Search posts...',
  value = '',
  onChange,
  className = '',
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative rounded-sm border transition-all duration-200 ${
          isFocused
            ? 'border-signal shadow-[0_0_0_3px_var(--color-signal-dim)]'
            : 'border-hairline hover:border-hairline-strong'
        }`}
      >
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-label={placeholder}
          className="w-full bg-paper-raised rounded-sm py-2.5 pl-9 pr-4 font-sans text-sm text-ink placeholder:text-ink-faint focus:outline-none"
          style={{ height: 44 }}
        />
      </div>
    </div>
  )
}
