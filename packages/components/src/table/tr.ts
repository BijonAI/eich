import { builtins, defineComponent } from '@eichjs/renderer'

export interface TrAttributes {
  // tr specific attributes can be added here if needed
}

const component = defineComponent<TrAttributes>((attrs, children) => {
  const tr = document.createElement('tr')
  tr.append(...children())

  return tr
})

builtins.set('tr', component)
export default component
