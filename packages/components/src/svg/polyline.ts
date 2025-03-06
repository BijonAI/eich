import { builtins, defineComponent, effect, useAttrs } from '@eichjs/renderer'
import { setAttributeIfExists } from './utils'

export interface PolylineAttributes {
  // Points data
  $points?: string

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

const component = defineComponent<PolylineAttributes>((attrs) => {
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

  const polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline')

  // Apply attributes and styles
  effect(() => {
    // Common SVG attributes
    setAttributeIfExists(polyline, 'points', points)
    setAttributeIfExists(polyline, 'fill', fill)
    setAttributeIfExists(polyline, 'stroke', stroke)
    setAttributeIfExists(polyline, 'stroke-width', strokeWidth)
    setAttributeIfExists(polyline, 'opacity', opacity)
    setAttributeIfExists(polyline, 'class', className)
    setAttributeIfExists(polyline, 'style', style)
    setAttributeIfExists(polyline, 'transform', transform)

    // Specific styling attributes
    setAttributeIfExists(polyline, 'fill-opacity', fillOpacity)
    setAttributeIfExists(polyline, 'stroke-opacity', strokeOpacity)
    setAttributeIfExists(polyline, 'stroke-dasharray', strokeDasharray)
    setAttributeIfExists(polyline, 'stroke-dashoffset', strokeDashoffset)
    setAttributeIfExists(polyline, 'stroke-linecap', strokeLinecap)
    setAttributeIfExists(polyline, 'stroke-linejoin', strokeLinejoin)
    setAttributeIfExists(polyline, 'stroke-miterlimit', strokeMiterlimit)
    setAttributeIfExists(polyline, 'filter', filter)
  })

  return polyline
})

builtins.set('polyline', component)
export default component
