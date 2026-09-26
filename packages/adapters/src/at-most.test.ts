import { describe, expect, it } from 'vitest'
import { atMost } from './at-most'

const later = () => {
  let done = () => {}
  const promise = new Promise<void>((resolve) => (done = resolve))
  return { promise, done }
}

describe('work done at most so many at a time', () => {
  it('makes the fifth wait until one of the first four is done', async () => {
    const inTurn = atMost(4)
    const works = Array.from({ length: 5 }, later)
    const started: number[] = []
    const all = works.map((work, index) =>
      inTurn(async () => {
        started.push(index)
        await work.promise
      }),
    )
    await Promise.resolve()
    expect(started).toEqual([0, 1, 2, 3])

    works[2]?.done()
    await all[2]
    await Promise.resolve()
    expect(started).toEqual([0, 1, 2, 3, 4])

    for (const work of works) work.done()
    await Promise.all(all)
  })

  it('lets the next one in when a work fails', async () => {
    const inTurn = atMost(1)
    await expect(inTurn(async () => Promise.reject(new Error('unreadable')))).rejects.toThrow()
    expect(await inTurn(async () => 'read')).toBe('read')
  })
})
