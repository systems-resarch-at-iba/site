# Systems Research @ IBA

The website for Systems Research at IBA: Next.js App Router, TypeScript, and Tailwind CSS v4.

## Stack

- **Next.js 16** (App Router, React 19, Turbopack)
- **TypeScript**, strict mode
- **Tailwind CSS v4** (CSS-first `@theme` config, see `app/globals.css`)
- **`marked`** + **`gray-matter`** for the blog's markdown/frontmatter pipeline
- **Vitest** for unit tests

## Getting started

`content/` is a git submodule (posts live in a [separate repo](https://github.com/systems-resarch-at-iba/blog)). Clone with submodules, or initialize them after the fact:

```bash
git clone --recurse-submodules git@github.com:systems-resarch-at-iba/site.git
# or, if already cloned without --recurse-submodules:
git submodule update --init
```

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve a production build |
| `npm run lint` | ESLint |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |

## Content model

Blog posts are Markdown files with YAML frontmatter, one per post, in `content/posts/`:

```
content/posts/
  my-post-slug.md
```

```yaml
---
title: "Post Title"
date: "2026-01-01"
author: author-slug        # must exist in lib/data.ts's AUTHORS map
category: "Operating Systems"
tags: ["Linux", "Scheduling"]
excerpt: "One or two sentences, ~160 characters."
status: published          # or draft; drafts are excluded from getAllPosts()
---

Post body in Markdown. Raw HTML is allowed (rendered as-is), so only merge
posts from trusted contributors via reviewed pull requests.
```

There's no CMS or web editor: a new post is a new Markdown file, reviewed and merged like any other change, in the [blog repo](https://github.com/systems-resarch-at-iba/blog). `lib/posts.ts` reads `content/posts/` at build/request time; `lib/markdown.ts` renders it and builds the table of contents.

## Project data

`lib/github.ts` fetches the org's real public repositories live from the GitHub REST API (unauthenticated, cached for an hour); nothing about `/projects` or the homepage's "From the lab" section is hand-maintained. If the org has no public repos yet, both sections degrade gracefully (an empty-state message, or the section not rendering at all).

## Directory guide

- `app/`: routes (App Router)
- `components/`: shared UI, mostly Server Components; `'use client'` only where a component actually needs state, effects, or a browser API
- `lib/`: data loading, types, and the small amount of pure logic (color derivation, markdown rendering, GitHub fetching) that's covered by tests
- `content/posts/`: blog post source, a git submodule (see above)
- `public/`: static assets, including PWA icons under `public/icons/`
- `tests/`: mirrors the source tree (`tests/lib/foo.test.ts` tests `lib/foo.ts`)

## Testing

Tests live under `tests/`, mirroring the structure of the code they cover, and focus on the pure, logic-heavy modules in `lib/`, the parts where a regression is both plausible and cheap to catch without a browser. Run them with `npm test`.
