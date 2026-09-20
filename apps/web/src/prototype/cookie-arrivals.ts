import { cookies } from 'next/headers'
import type { Account, Arrivals } from '@supersoft/domain'
import { ADDED_PROJECTS as ADDED, WHO_IS_HERE as WHO } from './cookie-names'

/** The one invented account this prototype knows. */
export const thePerson: Account = { handle: 'ben', name: 'Ben Layet' }

/**
 * The mock adapter for arrivals: the visitor's own browser remembers who they
 * are and which projects they added. No outside service, and throwing it away
 * costs a project nothing.
 */
export const cookieArrivals: Arrivals = {
  async whoIsHere() {
    const handle = (await cookies()).get(WHO)?.value
    return handle === thePerson.handle ? thePerson : undefined
  },
  async arrive(account: Account) {
    ;(await cookies()).set(WHO, account.handle, { path: '/' })
  },
  async leave() {
    ;(await cookies()).delete(WHO)
  },
  async addedProjects() {
    const kept = (await cookies()).get(ADDED)?.value
    return kept ? kept.split(',').filter(Boolean) : []
  },
  async addProject(projectId: string) {
    await keep((added) => added.add(projectId))
  },
  async removeProject(projectId: string) {
    await keep((added) => added.delete(projectId))
  },
}

/** The added projects, changed and written back where they live: this browser. */
const keep = async (change: (added: Set<string>) => void) => {
  const jar = await cookies()
  const kept = jar.get(ADDED)?.value
  const added = new Set(kept ? kept.split(',').filter(Boolean) : [])
  change(added)
  jar.set(ADDED, [...added].join(','), { path: '/' })
}
