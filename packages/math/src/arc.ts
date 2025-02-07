import { builtins, defineComponent, toValue, useAttrs } from '@eich/renderer'
import { arc } from 'idea-math'

export interface ArcAtrributes {
  $from: number
  $to: number
  $radius: number
}

const component = defineComponent<ArcAtrributes>((props) => {
  const { from, to, radius } = useAttrs(props, ['from', 'to', 'radius'])
  const a = arc(
    toValue(from) as unknown as number,
    toValue(to) as unknown as number,
    toValue(radius) as unknown as number,
  )
  return a.node()
})

builtins.set('arc', component)
export default component
