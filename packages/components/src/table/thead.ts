import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface TheadAttributes {
  '$text-align': CSSStyleDeclaration['textAlign']
  '$vertical-align': CSSStyleDeclaration['verticalAlign']
  '$background-color': CSSStyleDeclaration['backgroundColor']
}

const component = defineComponent<TheadAttributes>((attrs, children) => {
  const props = useAttrs(attrs, ['text-align', 'vertical-align', 'background-color'])
  const thead = document.createElement('thead')

  effect(() => {
    thead.style.textAlign = toValue(props['text-align']) ?? ''
    thead.style.verticalAlign = toValue(props['vertical-align']) ?? ''
    thead.style.backgroundColor = toValue(props['background-color']) ?? ''
  })

  thead.append(...children())

  return thead
})

builtins.set('thead', component)
export default component
