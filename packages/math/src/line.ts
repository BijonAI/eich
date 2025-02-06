import {
  builtins,
  defineComponent,
  effect,
  toValue,
  useAttrs,
} from '@eich/renderer'
import { line } from 'idea-math'

export interface LineAtrributes {
  '$from': [number, number]
  '$to': [number, number]
  '$stroke': string
  '$stroke-width': number
  '$point-size': number
  '$point-color': string
  '$point-opacity': number
  '$point-fill': string
  '$point-stroke': string
  '$point-stroke-width': number
}

/*
  TODO
  这里的 '$from' 和 '$to' 就是 <line-segment $from="[0, 0]" $to="[100, 100]"/> 里的
*/

const component = defineComponent<LineAtrributes>((props) => {
  const {
    from,
    to,
    stroke,
    'stroke-width': strokeWidth,
    'point-size': pointSize,
    'point-color': pointColor,
    'point-opacity': pointOpacity,
    'point-fill': pointFill,
    'point-stroke': pointStroke,
    'point-stroke-width': pointStrokeWidth,
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
    'point-stroke-width',
  ])

  const l = line(...toValue(from as unknown as [number, number]), ...toValue(to as unknown as [number, number]))
  effect(() => {
    l.stroke(toValue(stroke))
    l.style({
      strokeWidth: Number(toValue(strokeWidth)),
      strokeOpacity: Number(toValue(pointOpacity)),
      pointColor: toValue(pointColor),
      pointSize: Number(toValue(pointSize)),
      pointFill: toValue(pointFill),
      pointStroke: toValue(pointStroke),
      pointStrokeWidth: Number(toValue(pointStrokeWidth)),
      pointOpacity: Number(toValue(pointOpacity)),
    })
  })
  return l.node()
})

builtins.set('line', component)
export default component
