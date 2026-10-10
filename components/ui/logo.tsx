import { LOGO_FILES, type LogoKind } from '@/lib/logo'

interface LogoProps {
  kind: LogoKind
  /** Height of the logo in pixels. */
  size: number
  className?: string
}

/**
 * The logo, drawn in the current text colour: the file is used as a mask over a block of
 * `currentColor`, so it follows the theme and takes the colour of whatever text colour class is
 * set on it or on a parent, including a hover colour.
 */
export function Logo({ kind, size, className = '' }: LogoProps) {
  const { src, width, height } = LOGO_FILES[kind]
  const mask = `url(${src}) center / contain no-repeat`

  return (
    <span
      aria-hidden="true"
      className={`block bg-current ${className}`}
      style={{
        width: (size * width) / height,
        height: size,
        mask,
        WebkitMask: mask,
      }}
    />
  )
}
