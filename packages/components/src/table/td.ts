import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface TdAttributes {
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
}

const component = defineComponent<TdAttributes>((attrs, children) => {
  const props = useAttrs(attrs, ['padding', 'border', 'text-align', 'vertical-align', 'width', 'height', 'background-color', 'color', 'font-size', 'font-weight'])
  const td = document.createElement('td')
  td.append(...children())

  effect(() => {
    td.style.padding = toValue(props.padding) ?? ''
    td.style.border = toValue(props.border) ?? ''
    td.style.textAlign = toValue(props['text-align']) ?? ''
    td.style.verticalAlign = toValue(props['vertical-align']) ?? ''
    td.style.width = toValue(props.width) ?? ''
    td.style.height = toValue(props.height) ?? ''
    td.style.backgroundColor = toValue(props['background-color']) ?? ''
    td.style.color = toValue(props.color) ?? ''
    td.style.fontSize = toValue(props['font-size']) ?? ''
    td.style.fontWeight = toValue(props['font-weight']) ?? ''
  })

  return td
})

builtins.set('td', component)
export default component
