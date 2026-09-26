import { describe, expect, it } from 'vitest'
import { repositoryLink } from './repository-link'

describe('the link to a repository', () => {
  it('is its address, when a browser can open it', () => {
    expect(repositoryLink('https://example.org/medito')).toBe('https://example.org/medito')
  })

  it('is nothing for a repository on this machine', () => {
    expect(repositoryLink('/home/maker/medito')).toBeUndefined()
    expect(repositoryLink('file:///home/maker/medito')).toBeUndefined()
  })

  it('is nothing for an address that does not start with https://', () => {
    expect(repositoryLink('http://example.org/medito')).toBeUndefined()
    expect(repositoryLink('ssh://git@example.org/medito.git')).toBeUndefined()
    expect(repositoryLink('javascript://%0Aalert(1)')).toBeUndefined()
    expect(repositoryLink(' https://example.org/medito')).toBeUndefined()
  })
})
