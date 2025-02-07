import { builtins, defineComponent, effect /* , useAttrs */ } from '@eich/renderer'
import { plane } from 'idea-math'
import { wrap } from './utils'

export interface PlaneAttributes {
  width: number
  height: number
}

const component = defineComponent<PlaneAttributes>((props, children) => {
  // TODO
  // const { width, height } = useAttrs(props, ['width', 'height'])
  const kids = children()
  const coord = plane(
    // toValue(width) as unknown as number,
    // toValue(height) as unknown as number,
  )
  effect(() => {
    coord.axes('black')
  })
  kids.forEach((kid) => {
    coord.add(wrap(kid))
  })
  return coord.node()
})

builtins.set('plane', component)
export default component
