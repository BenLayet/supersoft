import { redirect } from 'next/navigation'

export default async function BusinessPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  redirect(`/projects/${projectId}/business/sources`)
}
