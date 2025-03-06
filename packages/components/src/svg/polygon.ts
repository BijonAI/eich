import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'
import { setAttributeIfExists } from './utils'

interface Point { x: number, y: number }

export interface PolygonAttributes {
  // Points data
  $points?: Point[] // Array of points defining the polygon

  // Common SVG attributes
  $fill?: string
  $stroke?: string
  '$stroke-width'?: string | number
  $opacity?: string | number
  $class?: string
  $style?: string
  $transform?: string

  // Specific styling attributes
  '$fill-opacity'?: string | number
  '$stroke-opacity'?: string | number
  '$stroke-dasharray'?: string
  '$stroke-dashoffset'?: string | number
  '$stroke-linecap'?: 'butt' | 'round' | 'square'
  '$stroke-linejoin'?: 'miter' | 'round' | 'bevel'
  '$stroke-miterlimit'?: string | number
  $filter?: string
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
    'stroke-width': strokeWidth,
    opacity,
    class: className,
    style,
    transform,
    'fill-opacity': fillOpacity,
    'stroke-opacity': strokeOpacity,
    'stroke-dasharray': strokeDasharray,
    'stroke-dashoffset': strokeDashoffset,
    'stroke-linecap': strokeLinecap,
    'stroke-linejoin': strokeLinejoin,
    'stroke-miterlimit': strokeMiterlimit,
    filter,
  } = useAttrs(attrs, [
    'points',
    'fill',
    'stroke',
    'stroke-width',
    'opacity',
    'class',
    'style',
    'transform',
    'fill-opacity',
    'stroke-opacity',
    'stroke-dasharray',
    'stroke-dashoffset',
    'stroke-linecap',
    'stroke-linejoin',
    'stroke-miterlimit',
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
