/** The link to a repository: its address, when a browser can open it. Nothing else ever becomes a link. */
export const repositoryLink = (address: string): string | undefined =>
  /^https:\/\/[^\s]+$/i.test(address) ? address : undefined
