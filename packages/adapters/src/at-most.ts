/** Runs work at most `count` at a time; the rest wait their turn, in order. */
export const atMost = (count: number) => {
  let running = 0
  const waiting: (() => void)[] = []
  return async <T>(work: () => Promise<T>): Promise<T> => {
    if (running < count) running++
    else await new Promise<void>((turn) => waiting.push(turn))
    try {
      return await work()
    } finally {
      const next = waiting.shift()
      if (next) next()
      else running--
    }
  }
}
