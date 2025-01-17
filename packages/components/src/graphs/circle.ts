import { defineComponent, getCurrentContext, intrinsics } from "@eich/renderer"

export interface CircleAttributes {
  r?: number
  cx?: number
  cy?: number
}

export const component = defineComponent<CircleAttributes>((attrs, children) => {
  const { _IS_IN_FIELD_TAG } = getCurrentContext()
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
  circle.setAttribute('r', attrs.r?.toString() ?? '0')
  circle.setAttribute('cx', attrs.cx?.toString() ?? '0')
  circle.setAttribute('cy', attrs.cy?.toString() ?? '0')
  circle.append(...children())

  if (!_IS_IN_FIELD_TAG) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const size = (attrs.r ?? 0) * 2
    svg.setAttribute('width', size.toString())
    svg.setAttribute('height', size.toString())
    svg.append(circle)
    return svg
  }
  return circle
})

intrinsics.set('circle', component)

export default component 