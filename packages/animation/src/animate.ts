/* eslint-disable no-sequences */
/* eslint-disable ts/ban-ts-comment */
// @ts-nocheck

const n = performance.now.bind(performance)
const r = requestAnimationFrame

function __animate(a, d, t, o) {
  let e, x
  const g = () => (x = (e + n()) / d, a(x >= 1 ? (o && o(), 1) : (r(g), t ? t(x) : x)))
  r(() => (e = -n(), g()))
}

export function animate(executor: (x: number) => void, duration: number, timing?: (x: number) => number): Promise<void> {
  return new Promise(resolve => __animate(executor, duration, timing, resolve))
}
