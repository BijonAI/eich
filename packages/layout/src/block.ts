import { builtins, defineComponent, effect, toValue, useAttrs } from '@eich/renderer'

export interface BlockAttributes {
  '$width': string
  '$height': string
  '$fill': string
  '$stroke': string
  '$stroke-width': number
  '$margin'?: string | number
  '$margin-top'?: string | number
  '$margin-right'?: string | number
  '$margin-bottom'?: string | number
  '$margin-left'?: string | number
  '$padding'?: string | number
  '$padding-top'?: string | number
  '$padding-right'?: string | number
  '$padding-bottom'?: string | number
  '$padding-left'?: string | number
  '$border'?: string | number
  '$border-radius'?: string | number
  '$border-width'?: string | number
  '$border-color'?: string
}

const component = defineComponent<BlockAttributes>((attrs, children) => {
  const { width, height, fill, stroke, 'stroke-width': strokeWidth, margin, 'margin-top': marginTop, 'margin-right': marginRight, 'margin-bottom': marginBottom, 'margin-left': marginLeft, padding, 'padding-top': paddingTop, 'padding-right': paddingRight, 'padding-bottom': paddingBottom, 'padding-left': paddingLeft, border, 'border-radius': borderRadius, 'border-width': borderWidth, 'border-color': borderColor } = useAttrs(attrs, ['width', 'height', 'fill', 'stroke', 'stroke-width', 'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left', 'border', 'border-radius', 'border-width', 'border-color'])
  const div = document.createElement('div')
  effect(() => {
    div.style.width = toValue(width) ?? 'auto'
    div.style.height = toValue(height) ?? 'auto'
    div.style.fill = toValue(fill) ?? 'none'
    div.style.stroke = toValue(stroke) ?? 'none'
    div.style.strokeWidth = toValue(strokeWidth) ?? '0'
    div.style.margin = toValue(margin) ?? '0'
    div.style.marginTop = toValue(marginTop) ?? '0'
    div.style.marginRight = toValue(marginRight) ?? '0'
    div.style.marginBottom = toValue(marginBottom) ?? '0'
    div.style.marginLeft = toValue(marginLeft) ?? '0'
    div.style.padding = toValue(padding) ?? '0'
    div.style.paddingTop = toValue(paddingTop) ?? '0'
    div.style.paddingRight = toValue(paddingRight) ?? '0'
    div.style.paddingBottom = toValue(paddingBottom) ?? '0'
    div.style.paddingLeft = toValue(paddingLeft) ?? '0'
    div.style.border = toValue(border) ?? 'none'
    div.style.borderRadius = toValue(borderRadius) ?? '0'
    div.style.borderWidth = toValue(borderWidth) ?? '0'
    div.style.borderColor = toValue(borderColor) ?? 'none'
  })
  div.append(...children())
  return div
})

builtins.set('block', component)
export default component
