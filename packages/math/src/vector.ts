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
  $from: [number, number]
  $to: [number, number]
  $stroke: string

  $origin: [number, number]
  $skew: [number, number]
  $scale: number
  $rotate: number
  $translate: [number, number]

  $tooltip: string
  $annotate: string
  $draggable: boolean
}

const component = defineComponent<VectorAttributes>((props) => {
  const {
    from,
    to,
    stroke,
    origin,
    skew,
    scale,
    rotate,
    translate,
    tooltip,
    annotate,
    trace,
    draggable,
  } = useAttrs(props, [
    'from',
    'to',
    'stroke',
    'origin',
    'skew',
    'scale',
    'rotate',
    'translate',
    'tooltip',
    'annotate',
    'trace',
    'draggable',
  ])

  const v = vector(...toValue(from as unknown as [number, number]), ...toValue(to as unknown as [number, number]))

  effect(() => {
    v.stroke(toValue(stroke))
    v.from(...toValue(from) as unknown as [number, number])
    v.to(...toValue(to) as unknown as [number, number])
    v.stroke(toValue(stroke))
    v.transform({
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
    v.annotate(toValue(annotate) as unknown as string)
    v.trace(toValue(trace))
    v.tooltip(toValue(tooltip) as unknown as string)
    if (draggable)
      v.draggable()
  })
  animateWithAttrs(props, animation)
  return v.node()
})

builtins.set('vector', component)
export default component
