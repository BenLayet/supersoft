import { describe, expect, it } from 'vitest'
import { mayChange, mayOpen, projectsFor } from './arrival'
import type { Account, AvailableProject } from './arrival'

const ben: Account = { handle: 'ben', name: 'Ben' }
const stranger: Account = { handle: 'alex', name: 'Alex' }

const project = (over: Partial<AvailableProject> = {}): AvailableProject => ({
  id: 'medito',
  name: 'Medito',
  owner: 'ben',
  address: 'kept/medito',
  isPublic: false,
  guardians: ['ben'],
  ...over,
})

describe('opening a project', () => {
  it('asks nothing of anyone when the project is public', () => {
    expect(mayOpen(project({ isPublic: true }))).toBe(true)
  })

  it('is closed to someone the project does not recognise', () => {
    expect(mayOpen(project(), stranger)).toBe(false)
    expect(mayOpen(project())).toBe(false)
  })

  it('opens to someone it recognises', () => {
    expect(mayOpen(project(), ben)).toBe(true)
  })
})

describe("someone's projects", () => {
  const mine = project({ id: 'medito' })
  const theirs = project({ id: 'claree', isPublic: true, guardians: ['alex'] })
  const shut = project({ id: 'shut', guardians: ['alex'] })
  const found = [mine, theirs, shut]

  it('holds nothing before anything is added, whoever they are', () => {
    expect(projectsFor(found, [], ben)).toEqual([])
  })

  it('holds what was added, in the order it was found', () => {
    expect(projectsFor(found, ['claree', 'medito'], ben).map((one) => one.id)).toEqual([
      'medito',
      'claree',
    ])
  })

  it('adds nothing that could not already be opened', () => {
    expect(projectsFor(found, ['shut'], ben)).toEqual([])
  })

  it('holds what someone who has not said who they are added', () => {
    expect(projectsFor(found, ['claree']).map((one) => one.id)).toEqual(['claree'])
  })
})

describe('changing a project', () => {
  it('needs someone the project already recognises', () => {
    expect(mayChange(project(), ben)).toBe(true)
    expect(mayChange(project(), stranger)).toBe(false)
  })

  it('is refused to someone who has not said who they are, public or not', () => {
    expect(mayChange(project({ isPublic: true }))).toBe(false)
  })
})
