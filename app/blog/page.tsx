import type { Metadata } from 'next'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { BlogIndex } from '@/components/blog/blog-index'
import { getAllPosts } from '@/lib/posts'

export const metadata: Metadata = { title: 'Blog' }

export default function BlogPage() {
  const posts = getAllPosts().map((post) => ({
    ...post,
    dateLabel: new Date(post.publishedAt!).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  }))

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <section className="mx-auto max-w-[1120px] px-6 py-12">
          <h1 className="mb-4 font-display text-[clamp(32px,5.5vw,56px)] font-bold text-ink">
            Blog
          </h1>
          <p className="font-serif text-base text-ink-muted">
            Technical writings and research from the Systems Research @ IBA group.
          </p>
        </section>

        <BlogIndex posts={posts} />
      </main>

      <Footer />
    </>
  )
}
