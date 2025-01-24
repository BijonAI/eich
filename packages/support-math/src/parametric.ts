import type { MaybeRef } from '@eich/renderer'
import type { coordinate } from 'idea-math'
import { builtins, defineComponent, effect, getCurrentContext, toValue, useAttrs } from '@eich/renderer'
import { parametric } from 'idea-math'

export interface ParametricAttributes {
  $expr: (t: number) => [number, number]
  $domain: [number, number]
  $samples: number
}

const component = defineComponent<ParametricAttributes>((props, children) => {
  const { expr, domain, samples }: { expr: MaybeRef<(t: number) => [number, number]>, domain: MaybeRef<[number, number]>, samples: MaybeRef<number> } = useAttrs(props, ['expr', 'domain', 'samples']) as any

  const fn = parametric(toValue(expr), toValue(domain))

  const { system }: { system: ReturnType<typeof coordinate> } = getCurrentContext() as any
  children()
  system.add(fn)

  effect(() => {
    if (toValue(samples))
      fn.samples(Number(toValue(samples)))
    else
      fn.samples(500)
    if (toValue(domain))
      fn.domain(...toValue(domain))
  })
})

builtins.set('parametric', component)
export default component
