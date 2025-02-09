import { animateWithAttrs, animation } from '@eich/animation'
import {
  builtins,
  defineComponent,
  effect,
  toValue,
  useAttrs,
} from '@eich/renderer'
import { polygon } from 'idea-math'

export interface PolygonAttributes {
  '$points': { x: number, y: number }[]
  '$set-unit': number
  '$draggable': boolean
}

const component = defineComponent<PolygonAttributes>((props) => {
  const {
    points,
    'set-unit': setUnit,
    draggable,
  } = useAttrs(props, ['points', 'set-unit', 'draggable'])

  const p = polygon(toValue(points as unknown as number[][]).map(([x, y]) => ({ x, y })))

  effect(() => {
    p.setUnit(Number(toValue(setUnit)))
    if (draggable)
      p.draggable()
  })
  animateWithAttrs(props, animation)
  return p.node()
})

builtins.set('poly', component)
export default component
