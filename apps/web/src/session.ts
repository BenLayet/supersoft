import { notFound } from 'next/navigation'
import { mayChange, mayOpen } from '@supersoft/domain'
import type { Account, AvailableProject, Project } from '@supersoft/domain'
import { cookieArrivals } from '@/prototype/cookie-arrivals'
import { findProject, inMemoryProjectStore } from '@/prototype/in-memory-project-store'

export interface Opened {
  account?: Account
  found: AvailableProject
  project: Project
  /** Changing anything means saying who you are, and being recognised. */
  writable: boolean
}

/** Opening a project: who is here, what they may see, and what they may change. */
export const open = async (projectId: string): Promise<Opened> => {
  const account = await cookieArrivals.whoIsHere()
  const found = await findProject(projectId, account)
  if (!found || !mayOpen(found, account)) notFound()

  const project = await inMemoryProjectStore.load(projectId)
  if (!project) notFound()

  return { account, found, project, writable: mayChange(found, account) }
}
