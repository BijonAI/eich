import { builtins, defineComponent, effect, toValue, useAttrs } from "@eich/renderer"

export interface UnderlineAttributes {
  '$stroke'?: string
  '$stroke-width'?: string
  '$offset'?: number
}

export const component = defineComponent<UnderlineAttributes>((props, children) => {
  const { stroke, 'stroke-width': strokeWidth, offset } = useAttrs(props, ['stroke', 'stroke-width', 'offset'])
  const span = document.createElement('span')
  effect(() => {
    span.style.textDecoration = 'underline'
    span.style.textDecorationColor = toValue(stroke) ?? 'black'
    span.style.textDecorationThickness = toValue(strokeWidth) ?? '1px'
    span.style.textDecorationSkipInk = toValue(offset) ?? 'auto'
  })
  span.append(...children())
  return span
})

builtins.set('underline', component)
export default component
