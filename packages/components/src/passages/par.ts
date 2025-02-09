import { builtins, defineComponent, effect, toValue, useAttrs } from '@eich/renderer'

export interface ParagraphAttributes {
  $leading: string | number
  $spacing: string | number
}

const component = defineComponent<ParagraphAttributes>((props, children) => {
  const { $leading, $spacing } = useAttrs(props, ['$leading', '$spacing'])
  const p = document.createElement('p')
  effect(() => {
    p.style.lineHeight = toValue($leading) ?? '1.5'
    p.style.margin = toValue($spacing) ?? '0'
  })
  p.append(...children())
  return p
})

builtins.set('par', component)

export default component
