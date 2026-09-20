'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isLocale } from '@/i18n'
import { LOCALE } from '@/prototype/cookie-names'
import { cookieArrivals, thePerson } from '@/prototype/cookie-arrivals'
import { inMemoryProjectStore } from '@/prototype/in-memory-project-store'

export async function arrive() {
  await cookieArrivals.arrive(thePerson)
  redirect('/')
}

export async function leave() {
  await cookieArrivals.leave()
  redirect('/')
}

/** An address, as it was typed: the scheme and a trailing slash change nothing. */
const plainly = (address: string) =>
  address.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/+$/, '')

/** Adding a project at its address. A public one is added without saying who you are. */
export async function openByAddress(formData: FormData) {
  const typed = plainly(String(formData.get('address') ?? ''))
  const account = await cookieArrivals.whoIsHere()
  const found = (await inMemoryProjectStore.available(account)).find((project) => {
    const address = plainly(project.address)
    return address === typed || address.endsWith(`/${typed}`)
  })
  if (!found) redirect(`/?unknown=${encodeURIComponent(typed)}`)
  await cookieArrivals.addProject(found.id)
  redirect(`/projects/${found.id}`)
}

/** Removing one from this person's own list. The project itself loses nothing. */
export async function removeProject(formData: FormData) {
  await cookieArrivals.removeProject(String(formData.get('projectId') ?? ''))
  redirect('/')
}

/** The language Supersoft speaks to this person. A convenience, like everything the browser keeps. */
export async function chooseLocale(formData: FormData) {
  const locale = formData.get('locale')
  if (isLocale(locale)) (await cookies()).set(LOCALE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365 })
}
