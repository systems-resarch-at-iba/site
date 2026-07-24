import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Systems Research @ IBA',
    short_name: 'SR@IBA',
    description: 'Research in systems design, architecture, and beyond.',
    start_url: '/',
    display: 'standalone',
    background_color: '#fafaf9',
    theme_color: '#0d9488',
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
