'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isLocale } from '@/i18n'
import { LOCALE } from '@/prototype/cookie-names'
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

/** The language Supersoft speaks to this person. A convenience, like everything the browser keeps. */
export async function chooseLocale(formData: FormData) {
  const locale = formData.get('locale')
  if (isLocale(locale)) (await cookies()).set(LOCALE, locale, { path: '/', maxAge: 60 * 60 * 24 * 365 })
}
