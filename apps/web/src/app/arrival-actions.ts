'use server'

import { redirect } from 'next/navigation'
import { cookieArrivals, thePerson } from '@/prototype/cookie-arrivals'
import { inMemoryProjectStore } from '@/prototype/in-memory-project-store'

export async function arrive() {
  await cookieArrivals.arrive(thePerson)
  const last = await cookieArrivals.lastOpened()
  redirect(last ? `/projects/${last}` : '/')
}

export async function leave() {
  await cookieArrivals.leave()
  redirect('/')
}

/** Naming a project that is open to everyone, without saying who you are. */
export async function openByName(formData: FormData) {
  const named = String(formData.get('name') ?? '')
    .trim()
    .toLowerCase()
  const account = await cookieArrivals.whoIsHere()
  const found = (await inMemoryProjectStore.available(account)).find(
    (project) => project.id.toLowerCase() === named || project.name.toLowerCase() === named,
  )
  redirect(found ? `/projects/${found.id}` : `/?unknown=${encodeURIComponent(named)}`)
}
