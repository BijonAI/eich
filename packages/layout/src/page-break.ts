import { animateWithAttrs, animation } from '@eichjs/animation'
import { builtins, defineComponent } from '@eichjs/renderer'

const component = defineComponent((_attrs, _children) => {
  const slot = document.createElement('slot')
  slot.name = 'page-break'
  animateWithAttrs(_attrs, animation, slot)()
  return slot
})
builtins.set('page-break', component)

export default component
