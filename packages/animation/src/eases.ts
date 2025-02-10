export type Ease = (t: number) => number

const c = 1.701_58
const n = 7.5625
const d = 2.75

function inverse(f: Ease): Ease {
  return (x: number): number => 1 - f(1 - x)
}

function solve(
  easeIn: Ease,
  easeOut?: Ease,
): Ease {
  easeOut ??= inverse(easeIn)

  return (x: number): number =>
    x < 0.5 ? easeIn(x * 2) / 2 : (easeOut(x * 2 - 1) + 1) / 2
}

function _(
  easeIn: Ease,
): [Ease, Ease, Ease] {
  const easeOut: Ease = inverse(easeIn)
  const easeInOut: Ease = solve(easeIn, easeOut)

  return [easeIn, easeOut, easeInOut]
}

const easeSine: Ease = x => 1 - Math.cos((x * Math.PI) / 2)
export const [easeInSine, easeOutSine, easeInOutSine] = _(easeSine)

export const [easeInQuad, easeOutQuad, easeInOutQuad] = _(x => x ** 2)
export const [easeInCubic, easeOutCubic, easeInOutCubic] = _(x => x ** 3)
export const [easeInQuart, easeOutQuart, easeInOutQuart] = _(x => x ** 4)
export const [easeInQuint, easeOutQuint, easeInOutQuint] = _(x => x ** 5)

const easeExpo: Ease = x => x || 2 ** (10 * x - 10)
const easeCirc: Ease = x => 1 - Math.sqrt(1 - x ** 2)
const easeBack: Ease = x => (c + 1) * x ** 3 - c * x ** 2
export const [easeInExpo, easeOutExpo, easeInOutExpo] = _(easeExpo)
export const [easeInCirc, easeOutCirc, easeInOutCirc] = _(easeCirc)
export const [easeInBack, easeOutBack, easeInOutBack] = _(easeBack)

const easeElastic: Ease = x =>
  -Math.sin(((80 * x - 44.5) * Math.PI) / 9) * 2 ** (20 * x - 11)
export const easeInElastic: Ease = x =>
  -Math.sin(((20 * x - 21.5) * Math.PI) / 3) * 2 ** (10 * x - 10)
export const easeOutElastic: Ease = inverse(easeInElastic)
export const easeInOutElastic: Ease = solve(easeElastic)

export const easeBounce: Ease = (x: number): number =>
  x < 1 / d
    ? n * x ** 2
    : x < 2 / d
      ? n * (x - 1.5 / d) ** 2 + 0.75
      : x < 2.5 / d
        ? n * (x - 2.25 / d) ** 2 + 0.9375
        : n * (x - 2.625 / d) ** 2 + 0.984_375

export function cubicBezier(p1x: number, p1y: number, p2x: number, p2y: number): Ease {
  const ax = 1 + 3 * (p1x - p2x)
  const bx = 3 * (p2x - 2 * p1x)
  const cx = 3 * p1x

  const dax = 3 * (3 * p1x - 3 * p2x + 1)
  const dbx = 3 * (-4 * p1x + 2 * p2x)
  const dcx = 3 * p1x

  const ay = 1 + 3 * (p1y - p2y)
  const by = 3 * (p2y - 2 * p1y)
  const cy = 3 * p1y

  function solveCurveX(x: number) {
    let t2 = x

    for (let i = 0; i < 8; i++) {
      const xValue = t2 * (cx + t2 * (bx + t2 * ax)) - x
      if (Math.abs(xValue) < 1e-6)
        return t2

      const dValue = dcx + t2 * (dbx + t2 * dax)
      if (Math.abs(dValue) < 1e-6)
        break

      t2 -= xValue / dValue
    }

    let t0 = 0
    let t1 = 1
    t2 = x

    while (t0 < t1) {
      const x2 = t2 * (cx + t2 * (bx + t2 * ax))
      if (Math.abs(x2 - x) < 1e-6)
        return t2

      x > x2 ? (t0 = t2) : (t1 = t2)
      t2 = (t0 + t1) * 0.5
    }

    return t2
  }

  return (x) => {
    if (x <= 0)
      return 0
    if (x >= 1)
      return 1

    const t = solveCurveX(x)
    return t * (cy + t * (by + t * ay))
  }
}

export type Keyframe = [t: number | number[], x: number]

export function keyframes(ease: Ease, ...keyframes: Keyframe[]): Ease {
  const points: [number, number][] = (keyframes as any[])
    .flatMap(v => Array.isArray(v[0]) ? v[0].map(x => [x, v[1]] as const) : [v])
    .sort((a, b) => a[0] - b[0])

  if (points.length < 1) {
    return ease
  }

  if (points[points.length - 1][0] != 1) {
    points.push([1, 1])
  }

  if (points[0][0] != 0) {
    points.splice(0, 0, [0, 0])
  }

  return (x: number): number => {
    if (x <= 0)
      return points[0][1]
    if (x >= 1)
      return points[points.length - 1][1]

    let i = 1
    while (i < points.length && points[i][0] < x) i++

    const [x0, y0] = points[i - 1]
    const [x1, y1] = points[i]

    return y0 + (y1 - y0) * ease((x - x0) / (x1 - x0))
  }
}
