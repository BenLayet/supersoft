import { redirect } from 'next/navigation'

export default async function UnderstandPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  redirect(`/projects/${projectId}/understand/scope`)
}
