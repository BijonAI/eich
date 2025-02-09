import { animateWithAttrs, animation } from '@eichjs/animation'
import {
  builtins,
  defineComponent,
  effect,
  toValue,
  useAttrs,
} from '@eichjs/renderer'
import { dot } from 'idea-math'

export interface DotAttributes {
  '$x': number
  '$y': number
  '$set-unit': number
  '$stroke': string
  '$border': number
  '$fill': string
  '$resize': number
  '$draggable': boolean
  // TODO: transform, animation, effect
  '$focus': string
  '$select': string
  '$onFocus': () => void
  '$onSelect': () => void
  '$onDrag': (x: number, y: number) => void
  '$event': (type: string, handler: (e: Event) => void) => { remove: () => void }
  '$attr': (name: string, value: string) => void
  '$data': (key: string, value: string) => void
  '$tooltip-content': string
  '$tooltip-position': number
  '$tooltip-offset': boolean
  '$tooltip-classname': string
  '$tooltip-style': string
}

const component = defineComponent<DotAttributes>((props) => {
  const { x, y, 'set-unit': setUnit, stroke, fill, draggable, resize, border, focus, select, onFocus, onSelect, 'tooltip-content': tooltipContent, 'tooltip-position': tooltipPosition, 'tooltip-offset': tooltipOffset, 'tooltip-classname': tooltipClassname, 'tooltip-style': tooltipStyle } = useAttrs(props, [
    'x',
    'y',
    'set-unit',
    'resize',
    'stroke',
    'fill',
    'draggable',
    'border',
    'focus',
    'select',
    'onFocus',
    'onSelect',
    'onDrag',
    'event',
    'attr',
    'data',
    'tooltip-content',
    'tooltip-position',
    'tooltip-offset',
    'tooltip-classname',
    'tooltip-style',
  ])

  const d = dot(toValue(x) as unknown as number, toValue(y) as unknown as number)
  effect(() => {
    d.stroke(toValue(stroke))
    d.setUnit(Number(toValue(setUnit)))
    d.fill(toValue(fill))
    d.resize(Number(toValue(resize)))
    d.border(Number(toValue(border)))
    d.focus(toValue(focus) as unknown as string)
    d.select(toValue(select) as unknown as string)
    if (typeof onFocus === 'function')
      d.onFocus(onFocus)
    if (typeof onSelect === 'function')
      d.onSelect(onSelect)
    // TODO: onDrag
    d.tooltip({
      content: toValue(tooltipContent),
      options: {
        position: toValue(tooltipPosition) as 'top' | 'bottom' | 'left' | 'right',
        offset: [Number(toValue(tooltipOffset)), Number(toValue(tooltipOffset))],
        className: toValue(tooltipClassname),
        style: toValue(tooltipStyle),
      },
    } as any)
    if (draggable)
      d.draggable()
  })
  animateWithAttrs(props, animation)
  return d.node()
})

builtins.set('dot', component)
export default component
