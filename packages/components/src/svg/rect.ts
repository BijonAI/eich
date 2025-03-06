import { builtins, defineComponent, effect, useAttrs } from '@eichjs/renderer'
import { setAttributeIfExists } from './utils'

export interface RectAttributes {
  // Points data
  $x?: string | number
  $y?: string | number
  $width?: string | number
  $height?: string | number

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

const component = defineComponent<RectAttributes>((attrs) => {
  const {
    x,
    y,
    width,
    height,
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
    'x',
    'y',
    'width',
    'height',
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

  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')

  // Apply attributes and styles
  effect(() => {
    // Common SVG attributes
    setAttributeIfExists(rect, 'x', x)
    setAttributeIfExists(rect, 'y', y)
    setAttributeIfExists(rect, 'width', width)
    setAttributeIfExists(rect, 'height', height)
    setAttributeIfExists(rect, 'fill', fill)
    setAttributeIfExists(rect, 'stroke', stroke)
    setAttributeIfExists(rect, 'stroke-width', strokeWidth)
    setAttributeIfExists(rect, 'opacity', opacity)
    setAttributeIfExists(rect, 'class', className)
    setAttributeIfExists(rect, 'style', style)
    setAttributeIfExists(rect, 'transform', transform)

    // Specific styling attributes
    setAttributeIfExists(rect, 'fill-opacity', fillOpacity)
    setAttributeIfExists(rect, 'stroke-opacity', strokeOpacity)
    setAttributeIfExists(rect, 'stroke-dasharray', strokeDasharray)
    setAttributeIfExists(rect, 'stroke-dashoffset', strokeDashoffset)
    setAttributeIfExists(rect, 'stroke-linecap', strokeLinecap)
    setAttributeIfExists(rect, 'stroke-linejoin', strokeLinejoin)
    setAttributeIfExists(rect, 'stroke-miterlimit', strokeMiterlimit)
    setAttributeIfExists(rect, 'filter', filter)
  })

  return rect
})

builtins.set('rect', component)
export default component
