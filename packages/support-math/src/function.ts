import { defineComponent, effect, getCurrentContext, intrinsics, toValue, useAttrs } from "@eich/renderer"
import { coordinate, func } from "idea-math"

export interface FuncAttributes {
  $expr: (x: number) => number
  $domain: [number, number]
  $samples: number
}

const component = defineComponent((props, children) => {
  const { expr, domain, samples } = useAttrs(props, ['expr', 'domain', 'samples'])
  const fn = func(toValue(expr) as unknown as (x: number) => number, toValue(domain) as unknown as [number, number])
  effect(() => {
    if (toValue(samples))
      fn.samples(Number(toValue(samples)))
    else
      fn.samples(500)
    if (toValue(domain))
      fn.domain(...toValue(domain) as unknown as [number, number])
  })
  const { system, unit } : { system: ReturnType<typeof coordinate>, unit: number } = getCurrentContext() as any
  children()
  fn.scale(unit)
  system.add(fn)
})

intrinsics.set('function', component)
export default component
