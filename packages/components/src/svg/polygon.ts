import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'
import { setAttributeIfExists } from './utils'

interface Point { x: number, y: number }

export interface PolygonAttributes {
  // Points data
  points?: Point[] // Array of points defining the polygon

  // Common SVG attributes
  fill?: string
  stroke?: string
  strokeWidth?: string | number
  opacity?: string | number
  class?: string
  style?: string
  transform?: string

  // Specific styling attributes
  fillOpacity?: string | number
  strokeOpacity?: string | number
  strokeDasharray?: string
  strokeDashoffset?: string | number
  strokeLinecap?: 'butt' | 'round' | 'square'
  strokeLinejoin?: 'miter' | 'round' | 'bevel'
  strokeMiterlimit?: string | number
  filter?: string
}

// Helper function to convert Point[] to SVG points string
function pointsToString(points: Point[]): string {
  return points.map(p => `${p.x},${p.y}`).join(' ')
}

const component = defineComponent<PolygonAttributes>((attrs) => {
  const {
    points,
    fill,
    stroke,
    strokeWidth,
    opacity,
    class: className,
    style,
    transform,
    fillOpacity,
    strokeOpacity,
    strokeDasharray,
    strokeDashoffset,
    strokeLinecap,
    strokeLinejoin,
    strokeMiterlimit,
    filter,
  } = useAttrs(attrs, [
    'points',
    'fill',
    'stroke',
    'strokeWidth',
    'opacity',
    'class',
    'style',
    'transform',
    'fillOpacity',
    'strokeOpacity',
    'strokeDasharray',
    'strokeDashoffset',
    'strokeLinecap',
    'strokeLinejoin',
    'strokeMiterlimit',
    'filter',
  ])

  const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon')

  // Apply attributes and styles
  effect(() => {
    // Points data
    const pointsValue = toValue(points) as unknown as Point[]
    if (pointsValue) {
      setAttributeIfExists(polygon, 'points', pointsToString(pointsValue))
    }

    // Common SVG attributes
    setAttributeIfExists(polygon, 'fill', fill)
    setAttributeIfExists(polygon, 'stroke', stroke)
    setAttributeIfExists(polygon, 'stroke-width', strokeWidth)
    setAttributeIfExists(polygon, 'opacity', opacity)
    setAttributeIfExists(polygon, 'class', className)
    setAttributeIfExists(polygon, 'style', style)
    setAttributeIfExists(polygon, 'transform', transform)

    // Specific styling attributes
    setAttributeIfExists(polygon, 'fill-opacity', fillOpacity)
    setAttributeIfExists(polygon, 'stroke-opacity', strokeOpacity)
    setAttributeIfExists(polygon, 'stroke-dasharray', strokeDasharray)
    setAttributeIfExists(polygon, 'stroke-dashoffset', strokeDashoffset)
    setAttributeIfExists(polygon, 'stroke-linecap', strokeLinecap)
    setAttributeIfExists(polygon, 'stroke-linejoin', strokeLinejoin)
    setAttributeIfExists(polygon, 'stroke-miterlimit', strokeMiterlimit)
    setAttributeIfExists(polygon, 'filter', filter)
  })

  return polygon
})

builtins.set('polygon', component)
export default component
