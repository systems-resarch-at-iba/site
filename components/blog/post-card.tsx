import Link from 'next/link'

interface PostCardProps {
  slug: string
  title: string
  excerpt: string
  author: string
  date: string
  tag: string
  readingTime: string
}

export function PostCard({
  slug,
  title,
  excerpt,
  author,
  date,
  tag,
  readingTime,
}: PostCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group block h-full">
      <article className="h-full flex flex-col rounded-md border border-hairline bg-paper-raised p-6 transition-colors duration-200 group-hover:border-hairline-strong">
        <h3 className="mb-2 font-display text-[clamp(18px,2.5vw,20px)] font-semibold text-ink transition-colors group-hover:text-signal">
          {title}
        </h3>

        <p className="mb-4 flex-1 font-serif text-[clamp(15px,1.5vw,16px)] text-ink-muted line-clamp-2">
          {excerpt}
        </p>

        <div className="flex items-center gap-3 overflow-hidden text-ellipsis whitespace-nowrap font-sans text-xs font-medium uppercase tracking-widest text-ink-faint">
          <span>{author}</span>
          <span>&middot;</span>
          <span>{date}</span>
          <span>&middot;</span>
          <span>{tag}</span>
          <span>&middot;</span>
          <span>{readingTime}</span>
        </div>
      </article>
    </Link>
  )
}
