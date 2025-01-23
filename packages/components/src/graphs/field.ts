import { defineComponent, intrinsics } from '@eich/renderer'

export interface FieldAttributes {
  width?: number
  height?: number
}

export const component = defineComponent<FieldAttributes>((attrs, children) => {
  const field = document.createElement('div')
  field.append(...children())
  return field
})

intrinsics.set('field', component)

export default component
