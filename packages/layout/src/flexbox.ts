import type { BlockAttributes } from './block'

import { defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'
import block from './block'

export interface FlexboxAttributes extends BlockAttributes {
  $direction?: 'row' | 'column'
  $justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
  $align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline'
  $grow?: number
  $shrink?: number
  $basis?: string | number
  $wrap?: 'nowrap' | 'wrap' | 'wrap-reverse'
  $gap?: string | number
}

const component = defineComponent<FlexboxAttributes>((attrs, children, node) => {
  const { direction, justify, align, width, height, grow, shrink, basis, wrap, gap } = useAttrs(attrs, ['direction', 'justify', 'align', 'width', 'height', 'grow', 'shrink', 'basis', 'wrap', 'gap'])
  const flexbox = block(attrs, children, node) as HTMLElement
  effect(() => {
    flexbox.style.display = 'flex'
    flexbox.style.flexDirection = toValue(direction) ?? 'row'
    flexbox.style.justifyContent = toValue(justify) ?? 'start'
    flexbox.style.alignItems = toValue(align) ?? 'start'
    flexbox.style.width = toValue(width) ?? 'auto'
    flexbox.style.height = toValue(height) ?? 'auto'
    flexbox.style.flexGrow = toValue(grow) ?? '0'
    flexbox.style.flexShrink = toValue(shrink) ?? '1'
    flexbox.style.flexBasis = toValue(basis) ?? 'auto'
    flexbox.style.flexWrap = toValue(wrap) ?? 'nowrap'
    flexbox.style.gap = toValue(gap) ?? '0'
  })
  
  return flexbox
})

export default component
