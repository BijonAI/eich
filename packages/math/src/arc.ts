import { animateWithAttrs, animation } from '@eich/animation'
import { builtins, defineComponent, effect, toValue, useAttrs } from '@eich/renderer'
import { arc } from 'idea-math'

export interface ArcAtrributes {
  '$arc-from': number
  '$arc-to': number
  '$arc-radius': number
  '$set-unit': number
  '$from': number
  '$to': number
  '$info': boolean

  '$origin': [number, number]
  '$skew': [number, number]
  '$scale': number
  '$rotate': number
  '$translate': [number, number]
}

const component = defineComponent<ArcAtrributes>((props) => {
  const {
    'arc-from': arcFrom,
    'arc-to': arcTo,
    'arc-radius': arcRadius,
    'set-unit': setUnit,
    origin,
    skew,
    scale,
    rotate,
    translate,
  } = useAttrs(props, ['arc-from', 'arc-to', 'arc-radius', 'set-unit', 'origin', 'skew', 'scale', 'rotate', 'translate', 'draggable'])
  const a = arc(
    toValue(arcFrom) as unknown as number,
    toValue(arcTo) as unknown as number,
    toValue(arcRadius) as unknown as number,
  )
  effect(() => {
    a.setUnit(toValue(setUnit) as unknown as number)
    a.transform({
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
  })
  animateWithAttrs(props, animation)
  return a.node()
})

builtins.set('arc', component)
export default component
