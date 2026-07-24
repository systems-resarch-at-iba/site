import fs from 'node:fs'
import path from 'node:path'

const IMAGES_DIR = path.join(process.cwd(), 'content', 'images')

const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
}

// Post images live in the blog submodule (content/images), not public/, so
// they aren't served by Next's static file handling automatically. This
// reads them straight from the submodule's checked-out files on each
// request instead of copying them into public/ at build time, so there's
// never a stale/duplicated copy to keep in sync.
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: segments } = await params
  const filename = segments.join('/')

  if (filename.includes('..')) return new Response('Not found', { status: 404 })

  const filePath = path.join(IMAGES_DIR, filename)
  if (!filePath.startsWith(IMAGES_DIR) || !fs.existsSync(filePath)) {
    return new Response('Not found', { status: 404 })
  }

  const contentType = CONTENT_TYPES[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream'
  return new Response(fs.readFileSync(filePath), {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
