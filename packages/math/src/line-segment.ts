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
  '$origin': [number, number]
  '$skew': [number, number]
  '$scale': number
  '$rotate': number
  '$translate': [number, number]
  '$annotate': string
  '$draggable': boolean
}

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
    origin,
    skew,
    scale,
    rotate,
    translate,
    annotate,
    draggable,
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
    'origin',
    'skew',
    'scale',
    'rotate',
    'translate',
    'annotate',
    'draggable',
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
    l.transform({
      origin: toValue(origin) as unknown as [number, number],
    })
      .transform({
        skew: toValue(skew) as unknown as [number, number],
      })
      .transform({
        scale: toValue(scale) as unknown as number,
      })
      .transform({
        rotate: toValue(rotate) as unknown as number,
      })
      .transform({
        translate: toValue(translate) as unknown as [number, number],
      })
    l.annotate(toValue(annotate) as unknown as string)
    if (draggable)
      l.draggable()
  })
  return l.node()
})

builtins.set('line', component)
export default component
