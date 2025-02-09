import { animateWithAttrs, animation } from '@eich/animation'
import {
  builtins,
  defineComponent,
  effect,
  toValue,
  useAttrs,
} from '@eich/renderer'
import { plane } from 'idea-math'
import { wrap } from './utils'

export interface PlaneAttributes {
  $width: number
  $height: number
  $grid: number
  $axes: string
  $ticks: number
}

const component = defineComponent<PlaneAttributes>((props, children) => {
  const { grid, axes, ticks } = useAttrs(props, ['grid', 'axes', 'ticks'])
  const kids = children()
  const p = plane()

  effect(() => {
    p.grid(Number(toValue(grid)))
    // TODO: axes bug
    p.axes(toValue(axes))
    p.ticks(Number(toValue(ticks)))
  })

  kids.forEach((kid) => {
    p.add(wrap(kid))
  })
  animateWithAttrs(props, animation)
  return p.node()
})

builtins.set('plane', component)
export default component
