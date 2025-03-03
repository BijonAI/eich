import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface TfootAttributes {
  // Box model attributes
  '$width': CSSStyleDeclaration['width']
  '$height': CSSStyleDeclaration['height']
  '$border': CSSStyleDeclaration['border']
  '$padding': CSSStyleDeclaration['padding']
  '$margin': CSSStyleDeclaration['margin']
  // background attributes
  '$background-color': CSSStyleDeclaration['backgroundColor']
  '$background-image': CSSStyleDeclaration['backgroundImage']
  '$background-position': CSSStyleDeclaration['backgroundPosition']
  '$background-repeat': CSSStyleDeclaration['backgroundRepeat']
  // text attributes
  '$color': CSSStyleDeclaration['color']
  '$font-family': CSSStyleDeclaration['fontFamily']
  '$font-size': CSSStyleDeclaration['fontSize']
  '$font-weight': CSSStyleDeclaration['fontWeight']
  '$text-align': CSSStyleDeclaration['textAlign']
}

const component = defineComponent<TfootAttributes>((attrs, children) => {
  const props = useAttrs(attrs, ['width', 'height', 'border', 'padding', 'margin', 'background-color', 'background-image', 'background-position', 'background-repeat', 'color', 'font-family', 'font-size', 'font-weight', 'text-align'])
  const tfoot = document.createElement('tfoot')

  effect(() => {
    tfoot.style.width = toValue(props.width) ?? ''
    tfoot.style.height = toValue(props.height) ?? ''
    tfoot.style.border = toValue(props.border) ?? ''
    tfoot.style.padding = toValue(props.padding) ?? ''
    tfoot.style.margin = toValue(props.margin) ?? ''
    tfoot.style.backgroundColor = toValue(props['background-color']) ?? ''
    tfoot.style.backgroundImage = toValue(props['background-image']) ?? ''
    tfoot.style.backgroundPosition = toValue(props['background-position']) ?? ''
    tfoot.style.backgroundRepeat = toValue(props['background-repeat']) ?? ''
    tfoot.style.color = toValue(props.color) ?? ''
    tfoot.style.fontFamily = toValue(props['font-family']) ?? ''
    tfoot.style.fontSize = toValue(props['font-size']) ?? ''
    tfoot.style.fontWeight = toValue(props['font-weight']) ?? ''
    tfoot.style.textAlign = toValue(props['text-align']) ?? ''
  })

  tfoot.append(...children())

  return tfoot
})

builtins.set('tfoot', component)
export default component
