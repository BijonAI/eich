import { builtins, defineComponent, effect, toValue, useAttrs } from '@eich/renderer'

export interface BlockAttributes {
  $width: string
  $height: string
  $fill: string
  $stroke: string
  '$stroke-width': number
}

const component = defineComponent<BlockAttributes>((attrs, children) => {
  const { width, height, fill, stroke, 'stroke-width': strokeWidth } = useAttrs(attrs, ['width', 'height', 'fill', 'stroke', 'stroke-width'])
  const div = document.createElement('div')
  effect(() => {
    div.style.width = toValue(width) ?? 'auto'
    div.style.height = toValue(height) ?? 'auto'
    div.style.fill = toValue(fill) ?? 'none'
    div.style.stroke = toValue(stroke) ?? 'none'
    div.style.strokeWidth = toValue(strokeWidth) ?? '0'
  })
  div.append(...children())
  return div
})

builtins.set('block', component)
export default component
