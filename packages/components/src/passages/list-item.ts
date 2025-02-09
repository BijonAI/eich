import { builtins, defineComponent } from '@eichjs/renderer'

export interface ListItemAttributes {
  type: 'li'
}

const component = defineComponent<ListItemAttributes>((props, children) => {
  const li = document.createElement('li')
  li.append(...children())
  return li
})

builtins.set('list-item', component)

export default component
