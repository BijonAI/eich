import { builtins, defineComponent, effect, toValue, useAttrs } from '@eich/renderer'
import { line } from 'idea-math'

export interface LineAtrributes {
  '$from': [number, number]
  '$to': [number, number]
  '$stroke': string
  '$stroke-width': number
}

const component = defineComponent<LineAtrributes>((props) => {
  const { from, to, stroke, 'stroke-width': strokeWidth } = useAttrs(props, ['from', 'to', 'stroke', 'stroke-width'])
  const l = line(...toValue(from) as unknown as [number, number], ...toValue(to) as unknown as [number, number])
  effect(() => {
    if (toValue(stroke)) {
      l.stroke(toValue(stroke))
    }
    if (toValue(strokeWidth)) {
      // l.strokeWidth(toValue(strokeWidth))
    }
  })
  return l.node()
})

builtins.set('line', component)
export default component
