import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { Tag } from '@/components/ui/tag'
import { TableOfContents } from '@/components/blog/table-of-contents'
import { AuthorBlock } from '@/components/blog/author-block'
import { PostNav } from '@/components/blog/post-nav'
import { CodeBlockEnhancer } from '@/components/blog/code-block-enhancer'
import { getAdjacentPosts, getPostBySlug, getPostSlugs } from '@/lib/posts'

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return { title: post.title, description: post.excerpt }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const { prev, next } = getAdjacentPosts(slug)
  const dateLabel = new Date(post.publishedAt!).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const metaItems = [post.author.name, dateLabel, post.category, `${post.readingMinutes} min read`]

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        {/* Centered header block */}
        <header className="mx-auto max-w-[760px] px-6 pb-10 pt-16 text-center md:pt-20">
          <h1 className="mb-4 font-display text-[clamp(28px,4.5vw,48px)] font-bold leading-tight text-ink">
            {post.title}
          </h1>
          <p className="mx-auto mb-5 max-w-2xl font-serif text-base text-ink-muted">
            {post.excerpt}
          </p>
          <div className="mb-5 flex flex-wrap items-center justify-center gap-x-2 font-sans text-sm text-ink-muted">
            {metaItems.map((item, i) => (
              <span key={item}>
                {item}
                {i < metaItems.length - 1 && <span className="ml-2 text-hairline-strong">|</span>}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {post.tags.map((tag) => (
              <Tag key={tag} label={tag} />
            ))}
          </div>
        </header>

        <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-12 border-t border-hairline px-6 py-12 lg:grid-cols-[680px_1fr]">
          <article className="min-w-0">
            <TableOfContents items={post.toc} variant="mobile" />

            <div className="post-body" dangerouslySetInnerHTML={{ __html: post.html }} />
            <CodeBlockEnhancer />

            <AuthorBlock author={post.author} />
            <PostNav prev={prev} next={next} />
          </article>

          <aside>
            <TableOfContents items={post.toc} variant="desktop" />
          </aside>
        </div>
      </main>

      <Footer />
    </>
  )
}
