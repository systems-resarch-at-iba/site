import type { Metadata } from 'next'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { ProjectsGrid } from '@/components/sections/projects-grid'
import { getRepos } from '@/lib/github'

export const metadata: Metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  const repos = await getRepos()

  return (
    <>
      <Navigation />
      <main className="min-h-screen">
        <section className="mx-auto max-w-[1120px] px-6 py-12">
          <h1 className="mb-4 font-display text-[clamp(32px,5.5vw,56px)] font-bold text-ink">
            Projects
          </h1>
          <p className="font-serif text-base text-ink-muted">
            Open-source projects and research tools from the Systems Research @ IBA group.
          </p>
        </section>

        <ProjectsGrid repos={repos} />
      </main>

      <Footer />
    </>
  )
}
