import { builtins, defineComponent } from '@eichjs/renderer'

export interface TdAttributes {
  // td specific attributes can be added here if needed
}

const component = defineComponent<TdAttributes>((attrs, children) => {
  const td = document.createElement('td')
  td.append(...children())

  return td
})

builtins.set('td', component)
export default component
