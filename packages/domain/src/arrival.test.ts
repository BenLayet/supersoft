import { describe, expect, it } from 'vitest'
import { mayChange, mayOpen } from './arrival'
import type { Account, AvailableProject } from './arrival'

const ben: Account = { handle: 'ben', name: 'Ben' }
const stranger: Account = { handle: 'alex', name: 'Alex' }

const project = (over: Partial<AvailableProject> = {}): AvailableProject => ({
  id: 'medito',
  name: 'Medito',
  owner: 'ben',
  openToEveryone: false,
  inTheForm: true,
  guardians: ['ben'],
  ...over,
})

describe('opening a project', () => {
  it('asks nothing of anyone when it is open to everyone', () => {
    expect(mayOpen(project({ openToEveryone: true }))).toBe(true)
  })

  it('is closed to someone the project does not recognise', () => {
    expect(mayOpen(project(), stranger)).toBe(false)
    expect(mayOpen(project())).toBe(false)
  })

  it('opens to someone it recognises', () => {
    expect(mayOpen(project(), ben)).toBe(true)
  })

  it('stays shut when Supersoft cannot read it, whoever is asking', () => {
    const unreadable = project({ inTheForm: false, openToEveryone: true })
    expect(mayOpen(unreadable, ben)).toBe(false)
    expect(mayOpen(unreadable)).toBe(false)
  })
})

describe('changing a project', () => {
  it('needs someone the project already recognises', () => {
    expect(mayChange(project(), ben)).toBe(true)
    expect(mayChange(project(), stranger)).toBe(false)
  })

  it('is refused to someone who has not said who they are, open or not', () => {
    expect(mayChange(project({ openToEveryone: true }))).toBe(false)
  })
})
