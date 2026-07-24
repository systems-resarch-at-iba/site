import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const variantClasses = {
  primary:
    'bg-signal text-white hover:bg-signal-ink active:bg-signal-ink disabled:opacity-50',
  secondary:
    'bg-signal-dim text-signal hover:bg-signal hover:text-white active:bg-signal-ink disabled:opacity-50',
  ghost:
    'bg-transparent text-ink hover:text-signal-ink border border-hairline-strong hover:border-signal-ink disabled:opacity-50',
}

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  disabled = false,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      className={`
        font-sans font-medium rounded-sm transition-all duration-200 cursor-pointer
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2
        disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}
