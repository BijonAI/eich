import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface StrikeAttributes {
  '$stroke'?: string
  '$stroke-width'?: string
  'offset'?: number
}

export const component = defineComponent<StrikeAttributes>((props, children) => {
  const { '$stroke': stroke, '$stroke-width': strokeWidth, offset } = useAttrs(props, ['$stroke', '$stroke-width', 'offset'])
  const span = document.createElement('span')
  effect(() => {
    span.style.textDecoration = 'line-through'
    span.style.textDecorationColor = toValue(stroke) ?? 'black'
    span.style.textDecorationThickness = toValue(strokeWidth) ?? '1px'
    span.style.textDecorationSkipInk = toValue(offset) ?? 'auto'
  })
  span.append(...children())
  return span
})

builtins.set('strike', component)
export default component
