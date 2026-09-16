import { redirect } from 'next/navigation'

export default async function SolutionPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  redirect(`/projects/${projectId}/solution/features`)
}
