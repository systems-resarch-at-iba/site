import type { AuthorRef, Contributor } from './types'

export const CONTRIBUTORS: Contributor[] = [
  {
    slug: 'salman-zaffar',
    name: 'Dr. Salman Zaffar',
    tier: 'lead',
    role: 'Assistant Professor & OBE Coordinator',
    bio: 'Assistant Professor and Coordinator of Outcome-Based Education (OBE) at IBA. Works across computer architecture, operating systems, and embedded systems, with a particular interest in RISC-V processor design and a background in nonlinear optimal control, applying optimization and reinforcement learning to real-world problems. Is the one motivating students each year to build non-conventional, project-based work bridging theory and implementation, the kind that make you reconsider your CS degree, in a good way.',
    email: 'szaffar@iba.edu.pk',
    github: 'https://github.com/salmanzaffar',
    linkedin: 'https://www.linkedin.com/in/salmanzaffar/',
    links: [
      { label: 'Email', url: 'mailto:szaffar@iba.edu.pk' },
      { label: 'GitHub', url: 'https://github.com/salmanzaffar' },
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/salmanzaffar/' },
    ],
  },
  {
    slug: 'syed-taha',
    name: 'Syed Taha',
    tier: 'core',
    role: 'BS CS Student @ IBA',
    bio: 'Distributed systems, inference, and AI/ML.',
    avatar: '/people/syedtaha.webp',
    website: 'https://syedtaha.dev',
  },
  {
    slug: 'hijab-eijaz',
    name: 'Hijab Eijaz',
    tier: 'core',
    role: 'BS CS Student @ IBA',
    bio: 'Distributed systems, security, and inference.',
    github: 'https://github.com/h-e19',
  },
  {
    slug: 'muhammad-usman',
    name: 'Muhammad Usman',
    tier: 'core',
    role: 'BS CS Student @ IBA',
    bio: 'Operating systems, distributed systems, and game theory.',
    avatar: '/people/muhammad_usman.webp',
    linkedin: 'https://www.linkedin.com/in/usman29257/',
  },
  {
    slug: 'hamna-sajid',
    name: 'Hamna Sajid',
    tier: 'contributor',
    role: 'CS Student @ IBA',
  },
  {
    slug: 'hadiya-muneeb',
    name: 'Hadiya Muneeb',
    tier: 'contributor',
    role: 'CS Student @ IBA',
  },
  {
    slug: 'hamza-ahmed',
    name: 'Hamza Ahmed',
    tier: 'contributor',
    role: 'CS Student @ IBA',
  },
  {
    slug: 'shiza-dewan',
    name: 'Shiza Dewan',
    tier: 'contributor',
    role: 'CS Student @ IBA',
  },
]

// Post authors: a superset of CONTRIBUTORS (adds the institutional byline
// used for group announcements) keyed by the slug used in post frontmatter.
export const AUTHORS: Record<string, AuthorRef> = {
  'systems-research-team': {
    name: 'Systems Research Team',
    slug: 'systems-research-team',
    bio: 'The collective byline for group announcements and updates.',
  },
  'syed-taha': {
    name: 'Syed Taha',
    slug: 'syed-taha',
    bio: 'Distributed systems, inference, and AI/ML.',
    avatar: '/people/syedtaha.webp',
  },
  'hijab-eijaz': {
    name: 'Hijab Eijaz',
    slug: 'hijab-eijaz',
    bio: 'Distributed systems, security, and inference.',
    github: 'https://github.com/h-e19',
  },
}

export function getContributor(slug: string): Contributor | undefined {
  return CONTRIBUTORS.find((c) => c.slug === slug)
}
