import { defineComponent, getCurrentContext, intrinsics } from "@eich/renderer"

export interface EllipseAttributes {
  rx?: number
  ry?: number
  cx?: number
  cy?: number
}

export const component = defineComponent<EllipseAttributes>((attrs, children) => {
  const { _IS_IN_FIELD_TAG } = getCurrentContext()
  const ellipse = document.createElementNS('http://www.w3.org/2000/svg', 'ellipse')
  ellipse.setAttribute('rx', attrs.rx?.toString() ?? '0')
  ellipse.setAttribute('ry', attrs.ry?.toString() ?? '0')
  ellipse.setAttribute('cx', attrs.cx?.toString() ?? '0')
  ellipse.setAttribute('cy', attrs.cy?.toString() ?? '0')
  ellipse.append(...children())

  if (!_IS_IN_FIELD_TAG) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', ((attrs.rx ?? 0) * 2).toString())
    svg.setAttribute('height', ((attrs.ry ?? 0) * 2).toString())
    svg.append(ellipse)
    return svg
  }
  return ellipse
})

intrinsics.set('ellipse', component)

export default component 