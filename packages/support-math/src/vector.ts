import type { coordinate } from 'idea-math'
import { defineComponent, getCurrentContext, builtins, toValue, useAttrs } from '@eich/renderer'
import { vector } from 'idea-math'

export interface VectorAttributes {
  $from: [number, number]
  $to: [number, number]
}

const component = defineComponent<VectorAttributes>((props, children) => {
  const { from, to } = useAttrs(props, ['from', 'to'])
  const vec = vector(...toValue(from) as unknown as [number, number], ...toValue(to) as unknown as [number, number])
  children()
  const { system }: { system: ReturnType<typeof coordinate> } = getCurrentContext() as any
  system.add(vec)
})

builtins.set('vector', component)
export default component
