import {
  builtins,
  defineComponent,
  effect,
  toValue,
  useAttrs,
} from '@eich/renderer'
import { dot } from 'idea-math'

export interface DotAttributes {
  $x: number
  $y: number
}

const component = defineComponent<DotAttributes>((props) => {
  const { x, y } = useAttrs(props, ['x', 'y', 'draggable'])
  const d = dot(
    toValue(x) as unknown as number,
    toValue(y) as unknown as number,
  )
  effect(() => {
    d.move(toValue(x) as unknown as number, toValue(y) as unknown as number)
  })
  return d.node()
})

builtins.set('dot', component)
export default component
