import {
  defineComponent,
  toValue,
  useAttrs,
} from '@eich/renderer'
import { parametric } from 'idea-math'

export interface ParametricAttributes {
  '$parametric-fn': (t: number) => [number, number]
  'parametric-range': [number, number]
}

export const component = defineComponent<ParametricAttributes>((props) => {
  const {
    'parametric-fn': fn,
    'parametric-range': range,
  } = useAttrs(props, [
    'parametric-fn',
    'parametric-range',
  ])
  // TODO
  return parametric(toValue(fn), toValue(range))
})
