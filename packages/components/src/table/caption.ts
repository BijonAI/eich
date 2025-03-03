import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface CaptionAttributes {
  '$text-align': CSSStyleDeclaration['textAlign']
  '$caption-side': CSSStyleDeclaration['captionSide']
}

const component = defineComponent<CaptionAttributes>((attrs, children) => {
  const props = useAttrs(attrs, ['text-align', 'caption-side'])
  const caption = document.createElement('caption')

  effect(() => {
    caption.style.textAlign = toValue(props['text-align']) ?? ''
    caption.style.captionSide = toValue(props['caption-side']) ?? ''
  })

  caption.append(...children())

  return caption
})

builtins.set('caption', component)
export default component
