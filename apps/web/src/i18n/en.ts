/** What Supersoft says, in English. Never what a project says: that is never translated. */
export const en = {
  description: 'Specifying and planning an application, with the customer in the conversation.',
  arrival: {
    addProject: 'Add a project',
    projectAddress: 'Address of its repository',
    openIt: 'Open',
    unreadable: (address: string) =>
      `Nothing can be read at “${address}”: there is no repository there, or it is private.`,
  },
  overview: {
    address: 'Address',
  },
}
