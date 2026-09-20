import { cookies, headers } from 'next/headers'
import { LOCALE, PROJECT_LANGUAGE } from '@/prototype/cookie-names'
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

const chosen = async (): Promise<Locale | undefined> => {
  const value = (await cookies()).get(LOCALE)?.value
  return isLocale(value) ? value : undefined
}

const asked = async (): Promise<Locale | undefined> =>
  ((await headers()).get('accept-language') ?? '')
    .split(',')
    .map((part) => part.split(';')[0].trim().slice(0, 2).toLowerCase())
    .find(isLocale)

/** What the person chose, else what their browser asks for, else English. */
export const currentLocale = async (): Promise<Locale> =>
  (await chosen()) ?? (await asked()) ?? 'en'

/** Whether this person asked to be spoken to in the language of what they read. */
export const speaksProjectLanguage = async (): Promise<boolean> =>
  (await cookies()).get(PROJECT_LANGUAGE)?.value !== 'no'

/**
 * While a project is being read: the language that project is written in, if
 * the person asked for that, else their own. Nothing is translated either way.
 */
export const localeIn = async (language: string): Promise<Locale> =>
  (await speaksProjectLanguage()) && isLocale(language) ? language : currentLocale()

export const dictionary = async (): Promise<Dictionary> => dictionaries[await currentLocale()]

export const dictionaryOf = (locale: Locale): Dictionary => dictionaries[locale]

export const dictionaryIn = async (language: string): Promise<Dictionary> =>
  dictionaryOf(await localeIn(language))

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
