import { defineComponent, getCurrentContext, builtins } from '@eich/renderer'

export interface RectAttributes {
  $width?: number
  $height?: number
}

export const component = defineComponent<RectAttributes>((attrs, children) => {
  const { _IS_IN_FIELD_TAG } = getCurrentContext()
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
  rect.setAttribute('width', attrs.$width?.toString() ?? '0')
  rect.setAttribute('height', attrs.$height?.toString() ?? '0')
  rect.append(...children())
  if (!_IS_IN_FIELD_TAG) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', attrs.$width?.toString() ?? '0')
    svg.setAttribute('height', attrs.$height?.toString() ?? '0')
    svg.append(rect)
    return svg
  }
  return rect
})

builtins.set('rect', component)

export default component
