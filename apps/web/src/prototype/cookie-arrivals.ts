import { cookies } from 'next/headers'
import type { Account, Arrivals } from '@supersoft/domain'
import { LAST_OPENED as LAST, WHO_IS_HERE as WHO } from './cookie-names'

/** The one invented account this prototype knows. */
export const thePerson: Account = { handle: 'ben', name: 'Ben Layet' }

/**
 * The mock adapter for arrivals: the visitor's own browser remembers who they
 * are and where they left off. No outside service, and throwing it away costs
 * a project nothing.
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
    const jar = await cookies()
    jar.delete(WHO)
    jar.delete(LAST)
  },
  async lastOpened() {
    return (await cookies()).get(LAST)?.value
  },
  async remember(projectId: string) {
    ;(await cookies()).set(LAST, projectId, { path: '/' })
  },
}
