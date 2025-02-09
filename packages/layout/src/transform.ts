import { animateWithAttrs, animation } from '@eichjs/animation'
import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export type AngleUnit = 'deg' | 'rad'
export type Angle = `${number}${AngleUnit}`

export function parseAngle(angle: Angle) {
  const numReg = /^\d+$/
  const unitReg = /^\w+$/
  const num = angle.match(numReg)
  const unit = angle.match(unitReg)
  return { num, unit }
}

export interface TransformAttributes {
  $translate?: number | [number, number]
  $rotate?: Angle
  $scale?: number | [number, number]
}

const component = defineComponent<TransformAttributes>((attrs, children) => {
  const transforms = useAttrs(attrs, ['translate', 'rotate', 'scale'])
  const div = document.createElement('div')
  effect(() => {
    const translate = toValue(transforms.translate)
    const rotate = toValue(transforms.rotate)
    const scale = toValue(transforms.scale)
    if (translate) {
      if (Array.isArray(translate)) {
        div.style.translate = `${translate[0]}px ${translate[1]}px`
      }
      else {
        div.style.translate = `${translate}px`
      }
    }
    if (rotate) {
      div.style.rotate = rotate
    }
    if (scale) {
      if (Array.isArray(scale)) {
        div.style.scale = `${scale[0]} ${scale[1]}`
      }
      else {
        div.style.scale = `${scale}`
      }
    }
  })
  div.append(...children())
  animateWithAttrs(attrs, animation, div)()
  return div
})

builtins.set('transform', component)

export default component
