
import { builtins, createDelegate, defineComponent, effect, getCurrentContext, toValue, useAttrs } from '@eichjs/renderer'

export interface InputAttributes {
  'type'?: string
  'value'?: string
  'placeholder'?: string
  'model'?: string
  '@input'?: string
  '@change'?: string
}

export const component = defineComponent<InputAttributes>((attrs, children) => {
  const props = useAttrs(attrs, ['type', 'value', 'placeholder', 'model'])
  const delegate = createDelegate(attrs)
  const element = document.createElement('input')
  effect(() => {
    element.type = toValue(props.type) ?? 'text'
    element.value = toValue(props.value) ?? ''
    element.placeholder = toValue(props.placeholder) ?? ''
    element.append(...children())
    delegate(element)
  })

  
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
