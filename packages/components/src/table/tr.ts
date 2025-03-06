import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface TrAttributes {
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

const component = defineComponent<TrAttributes>((attrs, children) => {
  const props = useAttrs(attrs, ['padding', 'border', 'text-align', 'vertical-align', 'width', 'height', 'background-color', 'color', 'font-size', 'font-weight'])
  const tr = document.createElement('tr')
  tr.append(...children())

  effect(() => {
    tr.style.padding = toValue(props.padding) ?? ''
    tr.style.border = toValue(props.border) ?? ''
    tr.style.textAlign = toValue(props['text-align']) ?? ''
    tr.style.verticalAlign = toValue(props['vertical-align']) ?? ''
    tr.style.width = toValue(props.width) ?? ''
    tr.style.height = toValue(props.height) ?? ''
    tr.style.backgroundColor = toValue(props['background-color']) ?? ''
    tr.style.color = toValue(props.color) ?? ''
    tr.style.fontSize = toValue(props['font-size']) ?? ''
    tr.style.fontWeight = toValue(props['font-weight']) ?? ''
  })

  return tr
})

builtins.set('tr', component)
export default component
