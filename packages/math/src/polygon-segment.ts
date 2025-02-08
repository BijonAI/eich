import {
  builtins,
  defineComponent,
  effect,
  toValue,
  useAttrs,
} from '@eich/renderer'
import { polygon } from 'idea-math'

export interface PolygonAttributes {
  '$points': [number, number][]
  '$set-unit': number
  '$draggable': boolean
}

const component = defineComponent<PolygonAttributes>((props) => {
  const {
    points,
    'set-unit': setUnit,
    draggable,
  } = useAttrs(props, ['points', 'set-unit', 'draggable'])

  const p = polygon(
    toValue(points as unknown as [number, number][]).map(point => ({
      x: point[0],
      y: point[1],
    })),
  )

  effect(() => {
    p.setUnit(Number(toValue(setUnit)))
    if (draggable)
      p.draggable()
  })
  return p.node()
})

builtins.set('polygon', component)
export default component
