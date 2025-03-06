import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface ThAttributes {
  // Box model attributes
  '$padding': CSSStyleDeclaration['padding']
  '$border': CSSStyleDeclaration['border']
  '$text-align': CSSStyleDeclaration['textAlign']
  '$vertical-align': CSSStyleDeclaration['verticalAlign']
  '$width': CSSStyleDeclaration['width']
  '$height': CSSStyleDeclaration['height']
  '$background-color': CSSStyleDeclaration['backgroundColor']
  '$color': CSSStyleDeclaration['color']
  '$font-size': CSSStyleDeclaration['fontSize']
  '$font-weight': CSSStyleDeclaration['fontWeight']
  '$scope': string
}

const component = defineComponent<ThAttributes>((attrs, children) => {
  const props = useAttrs(attrs, ['padding', 'border', 'text-align', 'vertical-align', 'width', 'height', 'background-color', 'color', 'font-size', 'font-weight', 'scope'])
  const th = document.createElement('th')
  th.append(...children())

  effect(() => {
    th.style.padding = toValue(props.padding) ?? ''
    th.style.border = toValue(props.border) ?? ''
    th.style.textAlign = toValue(props['text-align']) ?? ''
    th.style.verticalAlign = toValue(props['vertical-align']) ?? ''
    th.style.width = toValue(props.width) ?? ''
    th.style.height = toValue(props.height) ?? ''
    th.style.backgroundColor = toValue(props['background-color']) ?? ''
    th.style.color = toValue(props.color) ?? ''
    th.style.fontSize = toValue(props['font-size']) ?? ''
    th.style.fontWeight = toValue(props['font-weight']) ?? ''
    th.scope = toValue(props.scope) ?? ''
  })

  return th
})

builtins.set('th', component)
export default component
