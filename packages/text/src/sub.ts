import { builtins, defineComponent, effect, toValue, useAttrs } from "@eich/renderer"

export interface SubAttributes {
  $typographic?: boolean
  $baseline?: number
  $size?: number
}

export const component = defineComponent<SubAttributes>((props, children) => {
  const { typographic, baseline, size } = useAttrs(props, ['typographic', 'baseline', 'size'])
  const span = document.createElement('span')
  effect(() => {
    span.style.verticalAlign = 'sub'
    span.style.fontSize = toValue(size) ?? '0.6em'
    span.style.lineHeight = toValue(baseline) ?? '0.6em'
    span.style.textDecoration = toValue(typographic) ? 'sub' : 'none'
  })
  span.append(...children())
  return span
})

builtins.set('sub', component)
export default component
