import { builtins, defineComponent, effect, useAttrs } from '@eichjs/renderer'
import { setAttributeIfExists } from './utils'

export interface SvgAttributes {
  $width?: string | number
  $height?: string | number
  '$view-box'?: string
  $fill?: string
  $stroke?: string
  '$stroke-width'?: string | number
  $xmlns?: string
  '$preserve-aspect-ratio'?: string
  $class?: string
  $style?: string
  $transform?: string
  $opacity?: string | number
}

const component = defineComponent<SvgAttributes>((attrs, children) => {
  const {
    width,
    height,
    viewBox,
    fill,
    stroke,
    'stroke-width': strokeWidth,
    xmlns = 'http://www.w3.org/2000/svg',
    'preserve-aspect-ratio': preserveAspectRatio,
    class: className,
    style,
    transform,
    opacity,
  } = useAttrs(attrs, [
    'width',
    'height',
    'viewBox',
    'fill',
    'stroke',
    'stroke-width',
    'xmlns',
    'preserve-aspect-ratio',
    'class',
    'style',
    'transform',
    'opacity',
  ])

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

  effect(() => {
    setAttributeIfExists(svg, 'width', width)
    setAttributeIfExists(svg, 'height', height)
    setAttributeIfExists(svg, 'viewBox', viewBox)
    setAttributeIfExists(svg, 'fill', fill)
    setAttributeIfExists(svg, 'stroke', stroke)
    setAttributeIfExists(svg, 'stroke-width', strokeWidth)
    setAttributeIfExists(svg, 'xmlns', xmlns)
    setAttributeIfExists(svg, 'preserveAspectRatio', preserveAspectRatio)
    setAttributeIfExists(svg, 'class', className)
    setAttributeIfExists(svg, 'style', style)
    setAttributeIfExists(svg, 'transform', transform)
    setAttributeIfExists(svg, 'opacity', opacity)
  })

  svg.append(...children())

  return svg
})

builtins.set('svg', component)
export default component
