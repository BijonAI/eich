import { builtins, defineComponent } from '@eichjs/renderer'

export interface FieldAttributes {
  width?: number
  height?: number
}

export const component = defineComponent<FieldAttributes>((attrs, children) => {
  const field = document.createElement('div')
  field.append(...children())
  return field
})

builtins.set('field', component)

export default component
