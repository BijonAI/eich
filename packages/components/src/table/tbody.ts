import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface TbodyAttributes {
  '$text-align': CSSStyleDeclaration['textAlign']
  '$vertical-align': CSSStyleDeclaration['verticalAlign']
  '$background-color': CSSStyleDeclaration['backgroundColor']
}

const component = defineComponent<TbodyAttributes>((attrs, children) => {
  const props = useAttrs(attrs, ['text-align', 'vertical-align', 'background-color'])
  const tbody = document.createElement('tbody')

  effect(() => {
    tbody.style.textAlign = toValue(props['text-align']) ?? ''
    tbody.style.verticalAlign = toValue(props['vertical-align']) ?? ''
    tbody.style.backgroundColor = toValue(props['background-color']) ?? ''
  })

  tbody.append(...children())

  return tbody
})

builtins.set('tbody', component)
export default component
