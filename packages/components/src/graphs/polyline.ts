import { defineComponent, getCurrentContext, intrinsics } from "@eich/renderer"

export interface PolylineAttributes {
  $points?: string
  $fill?: string
}

export const component = defineComponent<PolylineAttributes>((attrs, children) => {
  const { _IS_IN_FIELD_TAG } = getCurrentContext()
  const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')
  polyline.setAttribute('points', attrs.$points ?? '')
  polyline.setAttribute('fill', attrs.$fill ?? 'none')
  polyline.append(...children())

  if (!_IS_IN_FIELD_TAG) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const points = attrs.$points?.split(/[\s,]+/).map(Number) ?? []
    const xPoints = points.filter((_, i) => i % 2 === 0)
    const yPoints = points.filter((_, i) => i % 2 === 1)
    const width = Math.max(...xPoints) - Math.min(...xPoints)
    const height = Math.max(...yPoints) - Math.min(...yPoints)
    svg.setAttribute('width', width.toString())
    svg.setAttribute('height', height.toString())
    svg.append(polyline)
    return svg
  }
  return polyline
})

intrinsics.set('polyline', component)

export default component 