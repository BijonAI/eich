import type { FlexboxAttributes } from './flexbox'

import { defineComponent, effect } from '@eichjs/renderer'
import flexbox from './flexbox'

const component = defineComponent<FlexboxAttributes>((attrs, children, node) => {
  const row = flexbox(attrs, children, node) as HTMLElement
  effect(() => {
    row.style.flexDirection = 'row'
    row.style.width = '100%'
    row.style.height = '100%'
  })
  
  return row
})

export default component
