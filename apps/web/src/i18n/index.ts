import { cookies, headers } from 'next/headers'
import { LOCALE } from '@/prototype/cookie-names'
import type { Dictionary } from './dictionary'
import { en } from './en'
import { fr } from './fr'

export type { Dictionary }

const dictionaries = { en, fr } satisfies Record<string, Dictionary>

/** The language Supersoft speaks to someone. Never the language a project is written in. */
export type Locale = keyof typeof dictionaries

export const locales = Object.keys(dictionaries) as Locale[]

export const isLocale = (value: unknown): value is Locale =>
  typeof value === 'string' && Object.hasOwn(dictionaries, value)

/** What the person chose, else what their browser asks for, else English. */
export const currentLocale = async (): Promise<Locale> => {
  const chosen = (await cookies()).get(LOCALE)?.value
  if (isLocale(chosen)) return chosen
  const asked = ((await headers()).get('accept-language') ?? '')
    .split(',')
    .map((part) => part.split(';')[0].trim().slice(0, 2).toLowerCase())
  return asked.find(isLocale) ?? 'en'
}

export const dictionary = async (): Promise<Dictionary> => dictionaries[await currentLocale()]

export const dictionaryOf = (locale: Locale): Dictionary => dictionaries[locale]

/**
 * The words a story is told with belong to the project, not to the reader: a
 * story written in French reads "En tant que…" whatever Supersoft speaks.
 */
export const storyWordsIn = (language: string): Dictionary['storyWords'] =>
  (isLocale(language) ? dictionaries[language] : en).storyWords

/** A language, named in the language Supersoft is speaking — or as the project wrote it. */
export const languageName = (language: string, locale: Locale): string => {
  try {
    return new Intl.DisplayNames([locale], { type: 'language' }).of(language) ?? language
  } catch {
    return String(language)
  }
}
