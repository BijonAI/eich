import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface ColgroupAttributes {
  // Style attributes
  '$width': CSSStyleDeclaration['width']
  '$background-color': CSSStyleDeclaration['backgroundColor']
  '$border': CSSStyleDeclaration['border']
  '$text-align': CSSStyleDeclaration['textAlign']
  '$vertical-align': CSSStyleDeclaration['verticalAlign']
  '$visibility': CSSStyleDeclaration['visibility']
  // Attributes
  '$span': HTMLTableColElement['span']
}

const component = defineComponent<ColgroupAttributes>((attrs, children) => {
  const props = useAttrs(attrs, ['width', 'background-color', 'border', 'text-align', 'vertical-align', 'visibility', 'span'])
  const colgroup = document.createElement('colgroup')

  effect(() => {
    colgroup.style.width = toValue(props.width) ?? ''
    colgroup.style.backgroundColor = toValue(props['background-color']) ?? ''
    colgroup.style.border = toValue(props.border) ?? ''
    colgroup.style.textAlign = toValue(props['text-align']) ?? ''
    colgroup.style.verticalAlign = toValue(props['vertical-align']) ?? ''
    colgroup.style.visibility = toValue(props.visibility) ?? ''
    colgroup.span = Number(toValue(props.span)) ?? 1
  })

  colgroup.append(...children())

  return colgroup
})

builtins.set('colgroup', component)
export default component
