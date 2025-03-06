import { builtins, defineComponent, effect, useAttrs } from '@eichjs/renderer'
import { setAttributeIfExists } from './utils'

export interface RectAttributes {
  // Points data
  x?: string | number
  y?: string | number
  width?: string | number
  height?: string | number

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

const component = defineComponent<RectAttributes>((attrs) => {
  const {
    x,
    y,
    width,
    height,
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
    'x',
    'y',
    'width',
    'height',
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
