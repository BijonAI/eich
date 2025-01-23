import { defineComponent, getCurrentContext, intrinsics } from '@eich/renderer'

export interface PolygonAttributes {
  $points?: string
}

export const component = defineComponent<PolygonAttributes>((attrs, children) => {
  const { _IS_IN_FIELD_TAG } = getCurrentContext()
  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')
  polygon.setAttribute('points', attrs.$points ?? '')
  polygon.append(...children())

  if (!_IS_IN_FIELD_TAG) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const points = attrs.$points?.split(/[\s,]+/).map(Number) ?? []
    const xPoints = points.filter((_, i) => i % 2 === 0)
    const yPoints = points.filter((_, i) => i % 2 === 1)
    const width = Math.max(...xPoints) - Math.min(...xPoints)
    const height = Math.max(...yPoints) - Math.min(...yPoints)
    svg.setAttribute('width', width.toString())
    svg.setAttribute('height', height.toString())
    svg.append(polygon)
    return svg
  }
  return polygon
})

intrinsics.set('polygon', component)

export default component
