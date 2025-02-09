import type { FlexboxAttributes } from './flexbox'
import { animateWithAttrs, animation } from '@eichjs/animation'
import { defineComponent, effect } from '@eichjs/renderer'
import flexbox from './flexbox'

const component = defineComponent<FlexboxAttributes>((attrs, children, node) => {
  const row = flexbox(attrs, children, node) as HTMLElement
  effect(() => {
    row.style.flexDirection = 'row'
    row.style.width = '100%'
    row.style.height = '100%'
  })
  animateWithAttrs(attrs, animation, row)()
  return row
})

export default component
