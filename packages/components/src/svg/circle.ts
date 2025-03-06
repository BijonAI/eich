import { builtins, defineComponent, effect, useAttrs } from '@eichjs/renderer'
import { setAttributeIfExists } from './utils'

export interface CircleAttributes {
  cx?: string | number
  cy?: string | number
  r?: string | number
  fill?: string
  stroke?: string
  strokeWidth?: string | number
  class?: string
  style?: string
  transform?: string
  opacity?: string | number
}

const component = defineComponent<CircleAttributes>((attrs) => {
  const {
    cx,
    cy,
    r,
    fill,
    stroke,
    strokeWidth,
    class: className,
    style,
    transform,
    opacity,
  } = useAttrs(attrs, [
    'cx',
    'cy',
    'r',
    'fill',
    'stroke',
    'strokeWidth',
    'class',
    'style',
    'transform',
    'opacity',
  ])

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')

  // Apply attributes and styles
  effect(() => {
    setAttributeIfExists(circle, 'cx', cx)
    setAttributeIfExists(circle, 'cy', cy)
    setAttributeIfExists(circle, 'r', r)
    setAttributeIfExists(circle, 'fill', fill)
    setAttributeIfExists(circle, 'stroke', stroke)
    setAttributeIfExists(circle, 'stroke-width', strokeWidth)
    setAttributeIfExists(circle, 'class', className)
    setAttributeIfExists(circle, 'style', style)
    setAttributeIfExists(circle, 'transform', transform)
    setAttributeIfExists(circle, 'opacity', opacity)
  })

  return circle
})

builtins.set('circle', component)
export default component
