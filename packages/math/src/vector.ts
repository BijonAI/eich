import { animateWithAttrs, animation } from '@eich/animation'
import {
  builtins,
  defineComponent,
  effect,
  toValue,
  useAttrs,
} from '@eich/renderer'
import { vector } from 'idea-math'

export interface VectorAttributes {
  '$from': [number, number]
  '$to': [number, number]
  '$stroke': string
  'stroke-width': number
  'point-size': number
  'point-color': string
  'point-opacity': number
  'point-fill': string
  'point-stroke': string
  'draggable': boolean
}

const component = defineComponent<VectorAttributes>((props) => {
  const {
    from,
    to,
    stroke,
    'stroke-width': strokeWidth,
    'point-size': pointSize,
    'point-color': pointColor,
    'point-opacity': pointOpacity,
  } = useAttrs(props, [
    'from',
    'to',
    'stroke',
    'stroke-width',
    'point-size',
    'point-color',
    'point-opacity',
    'point-fill',
    'point-stroke',
    'draggable',
  ])

  const v = vector(...toValue(from as unknown as [number, number]), ...toValue(to as unknown as [number, number]))

  effect(() => {
    v.stroke(toValue(stroke))
    v.style({
      strokeWidth: Number(toValue(strokeWidth)),
      pointSize: Number(toValue(pointSize)),
      pointColor: toValue(pointColor),
      pointOpacity: Number(toValue(pointOpacity)),
    })
  })
  animateWithAttrs(props, animation)
  return v.node()
})

builtins.set('vector', component)
export default component
