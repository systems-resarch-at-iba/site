import Link from 'next/link'

interface SectionHeaderProps {
  title: string
  viewAllLink?: string
  children: React.ReactNode
}

export function SectionHeader({ title, viewAllLink, children }: SectionHeaderProps) {
  return (
    <section className="mx-auto max-w-[1120px] px-6 py-16">
      <div className="mb-8 flex items-baseline justify-between">
        <h2 className="font-display text-[clamp(24px,4vw,36px)] font-semibold text-ink">
          {title}
        </h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="font-sans text-sm font-medium text-signal hover:text-signal-ink transition-colors"
          >
            View all &rarr;
          </Link>
        )}
      </div>
      {children}
    </section>
  )
}
