import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/sections/hero-section'
import { ResearchAreas } from '@/components/sections/research-areas'
import { SectionHeader } from '@/components/ui/section-header'
import { PostCard } from '@/components/blog/post-card'
import { StarIcon } from '@/components/ui/icons'
import { getAllPosts } from '@/lib/posts'
import { getRepos } from '@/lib/github'
import { languageColor } from '@/lib/language-colors'

const RESEARCH_AREAS = [
  {
    label: 'Operating Systems',
    description:
      'Adapting kernel-level scheduling, memory management, and I/O to support the resource demands of modern machine learning workloads, particularly on minimal or constrained operating systems.',
  },
  {
    label: 'Distributed Systems',
    description:
      'Distributing model inference across clusters of resource-constrained devices, including sharding strategy, fault tolerance, and communication-efficient coordination between nodes.',
  },
  {
    label: 'Architecture',
    description:
      'Mapping neural network computation onto open instruction set architectures, with an emphasis on vectorized execution and hardware-software co-design for edge and embedded targets.',
  },
  {
    label: 'Machine Learning Systems',
    description:
      'Investigating how compact a model architecture can be made without sacrificing performance, through architecture search, knowledge distillation, and quantization aimed at constrained hardware.',
  },
]

export default async function LandingPage() {
  const recentPosts = getAllPosts().slice(0, 3)
  const repos = (await getRepos()).slice(0, 3)

  return (
    <>
      <Navigation />
      <main>
        <HeroSection
          title="Systems Research"
          subtitle="at IBA"
          description="Advancing the design and implementation of systems for the next generation of computing, where operating systems, processor architecture, and distributed infrastructure meet the demands of modern AI."
          primaryAction={{ label: 'Read the blog', href: '/blog' }}
          secondaryAction={{
            label: 'View on GitHub',
            href: 'https://github.com/systems-resarch-at-iba',
          }}
        />

        <ResearchAreas areas={RESEARCH_AREAS} />

        <SectionHeader title="Latest from the blog" viewAllLink="/blog">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <PostCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                author={post.author.name}
                date={new Date(post.publishedAt!).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
                tag={post.category}
                readingTime={`${post.readingMinutes} min`}
              />
            ))}
          </div>
        </SectionHeader>

        {repos.length > 0 && (
          <SectionHeader title="From the lab (GitHub)" viewAllLink="/projects">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {repos.map((repo) => (
                <a
                  key={repo.repo}
                  href={repo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-md border border-hairline bg-paper-raised p-6 transition-colors hover:border-hairline-strong"
                >
                  <h3 className="mb-2 font-display font-semibold text-ink transition-colors group-hover:text-signal">
                    {repo.name}
                  </h3>
                  <p className="mb-4 font-serif text-sm text-ink-muted">{repo.description}</p>
                  <div className="flex items-center gap-4 font-sans text-xs font-medium text-ink-faint">
                    {repo.stars > 0 && (
                      <span className="flex items-center gap-1">
                        <StarIcon className="h-3 w-3 text-[#f5a623]" />
                        {repo.stars.toLocaleString()}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: languageColor(repo.language) }}
                        aria-hidden="true"
                      />
                      {repo.language}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </SectionHeader>
        )}
      </main>

      <Footer />
    </>
  )
}
