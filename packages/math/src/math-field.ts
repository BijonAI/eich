import { animateWithAttrs, animation } from '@eich/animation'
import { builtins, defineComponent, effect, toValue, useAttrs } from '@eich/renderer'
import { field } from 'idea-math'
import { wrap } from './utils'

export interface MathFieldAttributes {
  '$width': number
  '$height': number
  '$origin-x': number
  '$origin-y': number
}

const component = defineComponent<MathFieldAttributes>((props, children) => {
  const { width, height, 'origin-x': originX, 'origin-y': originY } = useAttrs(props, ['width', 'height', 'origin-x', 'origin-y'])
  const mathField = field(toValue(width) as unknown as number, toValue(height) as unknown as number)
  effect(() => {
    mathField.origin(toValue(originX) as unknown as number, toValue(originY) as unknown as number)
  })
  children().forEach((child) => {
    mathField.add(
      wrap(child),
    )
  })
  animateWithAttrs(props, animation, mathField.node())()
  return mathField.node()
})

builtins.set('math-field', component)
export default component
