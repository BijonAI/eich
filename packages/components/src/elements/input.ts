import { createDelegate, defineComponent, getCurrentContext, builtins } from '@eich/renderer'

export interface InputAttributes {
  'type'?: string
  'value'?: string
  'placeholder'?: string
  'model'?: string
  '@input'?: string
  '@change'?: string
}

export const component = defineComponent<InputAttributes>((attrs, children) => {
  const delegate = createDelegate(attrs)
  const element = document.createElement('input')
  element.type = attrs.type ?? 'text'
  element.value = attrs.value ?? ''
  element.placeholder = attrs.placeholder ?? ''
  element.append(...children())
  delegate(element)

  if (attrs.model) {
    const context = getCurrentContext()
    element.addEventListener('input', () => {
      context[attrs.model!] = element.value
    })
  }

  return element
})

builtins.set('input', component)

export default component
