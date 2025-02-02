import { builtins, defineComponent, effect, toValue, useAttrs } from "@eich/renderer"
import { vector } from "idea-math"

export interface VectorAttributes {
  $from: [number, number]
  $to: [number, number]
}

const component = defineComponent<VectorAttributes>((props) => {
  const { from, to } = useAttrs(props, ['from', 'to']) as unknown as {
    from: [number, number]
    to: [number, number]
  }
  const vec = vector(...toValue(from), ...toValue(to))
  effect(() => {
    const fromValues = toValue(from)
    const toValues = toValue(to)
    if (fromValues)
      vec.from(...fromValues)
    if (toValues)
      vec.to(...toValues)
  })
  return vec.node()
})

builtins.set('vector', component)
export default component
