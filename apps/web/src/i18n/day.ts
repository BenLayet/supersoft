/**
 * The day a workshop was held, read in the language Supersoft is speaking. The
 * date is a plain `YYYY-MM-DD`, so it is read as that day everywhere on earth.
 */
export const onDay = (date: string, locale: string): string =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
