import type { Metadata } from 'next'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { PlaygroundGrid } from '@/components/sections/playground-grid'
import { PLAYGROUNDS } from '@/lib/data'

export const metadata: Metadata = { title: 'Playground' }

export default function PlaygroundIndexPage() {
  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <section className="mx-auto max-w-[1120px] px-6 py-12">
          <h1 className="mb-4 font-display text-[clamp(32px,5.5vw,56px)] font-bold text-ink">
            Playground
          </h1>
          <p className="font-serif text-base text-ink-muted">
            Interactive demos from the group&apos;s research, running live in your browser.
          </p>
        </section>

        <PlaygroundGrid playgrounds={PLAYGROUNDS} />
      </main>

      <Footer />
    </>
  )
}
