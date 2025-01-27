/* eslint-disable no-sequences */

const n = performance.now.bind(performance) ?? Date.now
const r = requestAnimationFrame ?? (x => setTimeout(x, 16.67))

export function animate(f: (x: number) => void, d: number, t: (x: number) => number): Promise<void> {
  let e: number, x: number
  return new Promise((c) => {
    const g = () => {
      x = e + n() / d
      x = x > 1 ? 1 : (r(g), x < 0 ? 0 : x)
      f(t(x))
      x < 1 || c()
    }
    r(() => (e = n() / -d, g()))
  })
}
