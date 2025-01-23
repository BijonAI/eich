import { defineComponent, effect, intrinsics, patch, toValue, useAttrs, mergeContext, getCurrentContext, setCurrentContext } from '@eich/renderer'
import { coordinate, field } from 'idea-math'

export interface CoordinateAttributes {
  $width: number
  $height: number
  $unit: number
  '$origin-x': number
  '$origin-y': number
  '$grid-interval': number
  '$ticks-interval': number
  '$ticks-length': number
  '$labels-interval': number
  '$labels-format': (x: number) => string
  '$labels-step': number
}

const component = defineComponent<CoordinateAttributes>((props, children) => {
  const { width, height, unit, 'origin-x': originX, 'origin-y': originY, '$grid-interval': gridInterval, '$ticks-interval': ticksInterval, '$ticks-length': ticksLength, '$labels-interval': labelsInterval, '$labels-format': labelsFormat, '$labels-step': labelsStep } =
    useAttrs(props, ['width', 'height', 'unit', 'origin-x', 'origin-y', '$grid-interval', '$ticks-interval', '$ticks-length', '$labels-interval', '$labels-format', '$labels-step'])
  const system = coordinate(Number(toValue(width)), Number(toValue(height)))
  const node = system.node()
  const currentContext: { system: ReturnType<typeof field> } = getCurrentContext() as any
  currentContext.system.add(system)
  const context = mergeContext(currentContext, {
    system,
    unit,
  })
  setCurrentContext(context)
  children()
  effect(() => {
    if (toValue(originX) && toValue(originY))
      system.origin(Number(toValue(originX)), Number(toValue(originY)))
    else
      system.origin(Number(toValue(width)) / 2, Number(toValue(height)) / 2)
    if (toValue(labelsInterval))
      system.labels(
        Number(toValue(labelsInterval)),
        Number(toValue(labelsStep)) ?? 50,
        toValue(labelsFormat) as unknown as (x: number) => string
      )
    if (toValue(gridInterval))
      system.grid(Number(toValue(gridInterval)))
    if (toValue(ticksInterval) && toValue(ticksLength))
      system.ticks(Number(toValue(ticksInterval)), Number(toValue(ticksLength)))
    const newNode = system.node()
    patch(node, newNode)
  })
})

intrinsics.set('coordinate', component)
export default component
