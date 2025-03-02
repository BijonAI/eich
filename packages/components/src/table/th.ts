import { builtins, defineComponent } from '@eichjs/renderer'

export interface ThAttributes extends HTMLTableCellElement {
  // th specific attributes can be added here if needed
}

const component = defineComponent<ThAttributes>((attrs, children) => {
  const th = document.createElement('th')
  th.append(...children())

  return th
})

builtins.set('th', component)
export default component
