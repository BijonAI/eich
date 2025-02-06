import { builtins, defineComponent, effect, toValue, useAttrs } from '@eich/renderer'
import { arc } from 'idea-math'

export interface ArcAtrributes {
  $x: number
  $y: number
  $radius: number
  $from: number
  $to: number
}

const component = defineComponent<ArcAtrributes>((props) => {
  const { x, y, radius, from, to } = useAttrs(props, ['x', 'y', 'radius', 'from', 'to'])
  const a = arc(toValue(x) as unknown as number, toValue(y) as unknown as number, toValue(radius) as unknown as number)
  return a.node
})

builtins.set('arc', component)
export default component