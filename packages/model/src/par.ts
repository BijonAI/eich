import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface ParagraphAtrributes {
  $leading?: number
  $spacing?: number
  $justify?: boolean
}

const component = defineComponent<ParagraphAtrributes>((attrs, children) => {
  const { leading, spacing, justify } = useAttrs(attrs, ['leading', 'spacing', 'justify'])
  const paragraph = document.createElement('p')
  effect(() => {
    paragraph.style.lineHeight = toValue(leading) ?? 'normal'
    paragraph.style.letterSpacing = toValue(spacing) ?? 'normal'
    paragraph.style.textAlign = justify ? 'justify' : 'left'
  })
  paragraph.append(...children())
  return paragraph
})

builtins.set('par', component)
export default component
