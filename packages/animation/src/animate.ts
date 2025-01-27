/* eslint-disable no-sequences */
/* eslint-disable ts/ban-ts-comment */
// @ts-nocheck

const n = performance.now.bind(performance) ?? Date.now
const r = requestAnimationFrame ?? (x => setTimeout(x, 16.67))
function __animate(a, d, t, o) {
  let e, x
  const g = () => (x = e + n() / d, a(x >= 1 ? (o && o(), 1) : (r(g), t ? t(x) : x)))
  r(() => (e = n() / -d, g()))
}

export function animate(executor: (x: number) => void, duration: number, timing?: (x: number) => number): Promise<void> {
  return new Promise(resolve => __animate(executor, duration, timing, resolve))
}
