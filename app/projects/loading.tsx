import { Spinner } from '@/components/ui/spinner'

export default function ProjectsLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Spinner size={32} />
    </main>
  )
}
