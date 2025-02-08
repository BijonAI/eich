import {
  builtins,
  defineComponent,
  effect,
  toValue,
  useAttrs,
} from '@eich/renderer'
import { dot } from 'idea-math'

export interface DotAttributes {
  // TODO
  $x: number
  $y: number
  $stroke: string
  $fill: string
  $resize: number
  $draggable: boolean
}

const component = defineComponent<DotAttributes>((props) => {
  const { x, y, stroke, fill, draggable, resize } = useAttrs(props, [
    'x',
    'y',
    'stroke',
    'fill',
    'draggable',
    'resize',
  ])
  const d = dot(toValue(x) as unknown as number, toValue(y) as unknown as number)
  effect(() => {
    d.stroke(toValue(stroke))
    d.fill(toValue(fill))
    d.resize(Number(toValue(resize)))
    if (draggable)
      d.draggable()
  })
  return d.node()
})

builtins.set('dot', component)
export default component
