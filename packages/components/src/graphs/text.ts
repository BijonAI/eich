import { defineComponent, getCurrentContext, intrinsics } from "@eich/renderer"

export interface TextAttributes {
  x?: number
  y?: number
  fontSize?: number
  textAnchor?: 'start' | 'middle' | 'end'
  dominantBaseline?: 'auto' | 'middle' | 'hanging'
}

export const component = defineComponent<TextAttributes>((attrs, children) => {
  const { _IS_IN_FIELD_TAG } = getCurrentContext()
  const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
  text.setAttribute('x', attrs.x?.toString() ?? '0')
  text.setAttribute('y', attrs.y?.toString() ?? '0')
  if (attrs.fontSize) text.setAttribute('font-size', attrs.fontSize.toString())
  if (attrs.textAnchor) text.setAttribute('text-anchor', attrs.textAnchor)
  if (attrs.dominantBaseline) text.setAttribute('dominant-baseline', attrs.dominantBaseline)
  text.append(...children())

  if (!_IS_IN_FIELD_TAG) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const bbox = text.getBBox()
    svg.setAttribute('width', bbox.width.toString())
    svg.setAttribute('height', bbox.height.toString())
    svg.append(text)
    return svg
  }
  return text
})

intrinsics.set('text', component)

export default component 