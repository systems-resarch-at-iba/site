import Image from 'next/image'
import { UserIcon } from './icons'

interface PersonAvatarProps {
  size: number
  className?: string
  src?: string
  alt?: string
}

/**
 * A real photo when the person has one on file; otherwise a flat circular
 * placeholder with a generic user icon on it: clearer at a glance than an
 * empty circle, without pretending to be an actual photo.
 */
export function PersonAvatar({ size, className = '', src, alt = '' }: PersonAvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={`shrink-0 rounded-full object-cover ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-hairline ${className}`}
      style={{ width: size, height: size }}
    >
      <UserIcon className="text-signal" style={{ width: size * 0.5, height: size * 0.5 }} />
    </div>
  )
}
