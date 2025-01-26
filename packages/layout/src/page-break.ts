import { builtins, defineComponent } from '@eich/renderer'

const component = defineComponent((_attrs, _children) => {
  const slot = document.createElement('slot')
  slot.name = 'page-break'
  return slot
})

builtins.set('page-break', component)

export default component
