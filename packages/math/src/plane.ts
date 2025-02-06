import { builtins, defineComponent, effect } from '@eich/renderer'
import { plane } from 'idea-math'

export interface PlaneAttributes {

}

const component = defineComponent<PlaneAttributes>((props, children) => {
  const kids = children()
  const coord = plane()
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
