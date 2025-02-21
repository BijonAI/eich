
import {
  builtins,
  defineComponent,
  effect,
  toValue,
  useAttrs,
} from '@eichjs/renderer'
import { parametric } from 'idea-math'

export interface ParametricAttributes {
  '$parametric-fn': (t: number) => [number, number]
  '$parametric-range': [number, number]
  '$set-unit': number
  '$draggable': boolean
}

const component = defineComponent<ParametricAttributes>((props) => {
  const {
    'parametric-fn': fn,
    'parametric-range': range,
    'set-unit': setUnit,
    draggable,
  } = useAttrs(props, [
    'parametric-fn',
    'parametric-range',
    'set-unit',
    'draggable',
  ])

  const p = parametric(toValue(fn) as unknown as (t: number) => [number, number], toValue(range) as unknown as [number, number])
  effect(() => {
    p.setUnit(Number(toValue(setUnit)))
    if (draggable)
      p.draggable()
  })
  
  return p.node()
})

builtins.set('parametric', component)
export default component
