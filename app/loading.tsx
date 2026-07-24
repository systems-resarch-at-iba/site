import { Spinner } from '@/components/ui/spinner'

// Root-level fallback: covers the home route directly (it's one async
// component blocking on both local posts and a live GitHub fetch), and
// acts as the fallback for any other route that doesn't define its own
// more specific loading.tsx (like app/projects/loading.tsx does).
export default function RootLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Spinner size={32} />
    </main>
  )
}
