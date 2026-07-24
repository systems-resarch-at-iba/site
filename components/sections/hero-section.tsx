import Link from 'next/link'
import { Button } from '../ui/button'

interface HeroSectionProps {
  title: string
  subtitle: string
  description?: string
  primaryAction?: { label: string; href: string }
  secondaryAction?: { label: string; href: string }
}

export function HeroSection({
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
}: HeroSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-12 md:py-24">
      <div className="max-w-4xl">
        <h1 className="mb-4 font-display text-[clamp(48px,7vw,88px)] font-bold leading-tight tracking-tight text-ink">
          {title}
          <br />
          {subtitle}
        </h1>

        {description && (
          <p className="mb-10 max-w-2xl font-serif text-[clamp(17px,1.5vw,19px)] leading-relaxed text-ink-muted">
            {description}
          </p>
        )}

        {(primaryAction || secondaryAction) && (
          <div className="flex flex-col items-start gap-4 sm:flex-row">
            {primaryAction && (
              <Link href={primaryAction.href}>
                <Button variant="primary" size="lg">
                  {primaryAction.label}
                </Button>
              </Link>
            )}
            {secondaryAction && (
              <a href={secondaryAction.href} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="lg">
                  {secondaryAction.label} {'\u2197'}
                </Button>
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
