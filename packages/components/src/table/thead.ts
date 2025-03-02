import { builtins, defineComponent } from '@eichjs/renderer'

export interface TheadAttributes {
  // thead specific attributes can be added here if needed
}

const component = defineComponent<TheadAttributes>((attrs, children) => {
  const thead = document.createElement('thead')
  thead.append(...children())

  return thead
})

builtins.set('thead', component)
export default component
