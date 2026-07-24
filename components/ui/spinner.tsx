interface SpinnerProps {
  size?: number
  className?: string
}

/** Standard loading spinner. */
export function Spinner({ size = 24, className = '' }: SpinnerProps) {
  return (
    <div
      className={`inline-block rounded-full border-2 border-signal-dim border-t-signal motion-safe:animate-spin ${className}`}
      style={{ width: size, height: size }}
      role="status"
      aria-label="Loading"
    />
  )
}
