import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface HighlightAttributes {
  '$fill'?: string
  '$stroke'?: string
  '$stroke-width'?: number
  'radius'?: number
}

export const component = defineComponent<HighlightAttributes>((props, children) => {
  const { fill, stroke, '$stroke-width': strokeWidth, radius } = useAttrs(props, ['fill', 'stroke', '$stroke-width', 'radius'])
  const highlight = document.createElement('span')
  effect(() => {
    highlight.style.backgroundColor = toValue(fill) ?? 'yellow'
    highlight.style.border = toValue(stroke) ?? 'none'
    highlight.style.borderWidth = toValue(strokeWidth) ?? '1px'
    highlight.style.borderRadius = toValue(radius) ?? '0px'
  })
  highlight.append(...children())

  return highlight
})

builtins.set('highlight', component)
export default component
