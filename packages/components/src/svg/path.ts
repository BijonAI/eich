import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'
import { setAttributeIfExists } from './utils'

// Helper types for path commands
interface Point { x: number, y: number }
type CurvePoint = Point & { control1: Point, control2?: Point }

export interface PathCommand {
  type: 'M' | 'm' | 'L' | 'l' | 'H' | 'h' | 'V' | 'v' | 'C' | 'c' | 'S' | 's' | 'Q' | 'q' | 'T' | 't' | 'A' | 'a' | 'Z' | 'z'
  points: (Point | CurvePoint)[]
}

export interface PathAttributes {
  // Path data
  $commands?: PathCommand[] // Changed from $commands
  $d?: string // Changed from $d

  // Common SVG attributes
  $fill?: string
  $stroke?: string
  '$stroke-width'?: string | number
  $opacity?: string | number
  $class?: string
  $style?: string
  $transform?: string

  // Path specific attributes
  '$fill-opacity'?: string | number
  '$stroke-opacity'?: string | number
  '$stroke-dasharray'?: string
  '$stroke-dashoffset'?: string | number
  '$stroke-linecap'?: 'butt' | 'round' | 'square'
  '$stroke-linejoin'?: 'miter' | 'round' | 'bevel'
  '$stroke-miterlimit'?: string | number
  $filter?: string
}

// Helper function to convert PathCommand[] to SVG path data string
function commandsToPathData(commands: PathCommand[]): string {
  return commands.map((cmd) => {
    const { type, points } = cmd

    switch (type) {
      case 'M':
      case 'm':
      case 'L':
      case 'l':
        return `${type}${points.map(p => `${p.x},${p.y}`).join(' ')}`

      case 'H':
      case 'h':
        return `${type}${points.map(p => p.x).join(' ')}`

      case 'V':
      case 'v':
        return `${type}${points.map(p => p.y).join(' ')}`

      case 'C':
      case 'c':
        return `${type}${points.map((p) => {
          const cp = p as CurvePoint
          return `${cp.control1.x},${cp.control1.y} ${cp.control2?.x ?? cp.x},${cp.control2?.y ?? cp.y} ${cp.x},${cp.y}`
        }).join(' ')}`

      case 'S':
      case 's':
      case 'Q':
      case 'q':
        return `${type}${points.map((p) => {
          const cp = p as CurvePoint
          return `${cp.control1.x},${cp.control1.y} ${cp.x},${cp.y}`
        }).join(' ')}`

      case 'T':
      case 't':
        return `${type}${points.map(p => `${p.x},${p.y}`).join(' ')}`

      case 'A':
      case 'a':
        return `${type}${points.map((p) => {
          const ap = p as any // Arc parameters
          return `${ap.rx},${ap.ry} ${ap.xRotation} ${ap.largeArc ? 1 : 0},${ap.sweep ? 1 : 0} ${p.x},${p.y}`
        }).join(' ')}`

      case 'Z':
      case 'z':
        return type

      default:
        return ''
    }
  }).join(' ')
}

const component = defineComponent<PathAttributes>((attrs) => {
  const {
    commands,
    d,
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
    'commands',
    'd',
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

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')

  // Apply attributes and styles
  effect(() => {
    const commandsValue = toValue(commands) as unknown as PathCommand[]
    // Handle path data
    if (commandsValue && commandsValue.length > 0) {
      setAttributeIfExists(path, 'd', commandsToPathData(commandsValue))
    }
    else if (d) {
      setAttributeIfExists(path, 'd', d)
    }

    // Common SVG attributes
    setAttributeIfExists(path, 'fill', fill)
    setAttributeIfExists(path, 'stroke', stroke)
    setAttributeIfExists(path, 'stroke-width', strokeWidth)
    setAttributeIfExists(path, 'opacity', opacity)
    setAttributeIfExists(path, 'class', className)
    setAttributeIfExists(path, 'style', style)
    setAttributeIfExists(path, 'transform', transform)

    // Path specific attributes
    setAttributeIfExists(path, 'fill-opacity', fillOpacity)
    setAttributeIfExists(path, 'stroke-opacity', strokeOpacity)
    setAttributeIfExists(path, 'stroke-dasharray', strokeDasharray)
    setAttributeIfExists(path, 'stroke-dashoffset', strokeDashoffset)
    setAttributeIfExists(path, 'stroke-linecap', strokeLinecap)
    setAttributeIfExists(path, 'stroke-linejoin', strokeLinejoin)
    setAttributeIfExists(path, 'stroke-miterlimit', strokeMiterlimit)
    setAttributeIfExists(path, 'filter', filter)
  })

  return path
})

builtins.set('path', component)
export default component
