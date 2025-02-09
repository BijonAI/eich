import type { MaybeRef } from '@eichjs/renderer'
import { animateWithAttrs, animation } from '@eichjs/animation'
import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export type AlignType =
  'left' | 'center' | 'right'
  | 'top' | 'horizontal' | 'bottom'
  | 'start' | 'end'

export interface AlignAttributes {
  $type: AlignType | Array<AlignType>
}

const component = defineComponent<AlignAttributes>((attrs, children) => {
  const { type }: { type: MaybeRef<AlignType | Array<AlignType>> } = useAttrs(attrs, ['type']) as { type: MaybeRef<AlignType | Array<AlignType>> }
  let types: string
  if (Array.isArray(toValue(type))) {
    types = (toValue(type) as string[]).join(' ')
  }
  else if (typeof toValue(type) === 'string') {
    types = toValue(type) as string
  }
  const div = document.createElement('div')
  effect(() => {
    div.style.textAlign = toValue(types)
  })
  div.append(...children())
  animateWithAttrs(attrs, animation, div)()
  return div
})

builtins.set('align', component)

export default component
