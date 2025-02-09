import { animateWithAttrs, animation } from '@eichjs/animation'
import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface FontAttributes {
  '$size'?: number
  '$weight'?: number
  '$family'?: string
  '$color'?: string
  '$line-height'?: number
  '$letter-spacing'?: number
  '$background-color'?: string
  '$text-decoration'?: string
  '$text-align'?: string
  '$text-transform'?: string
  '$font-style'?: string
  '$word-spacing'?: number
  '$text-shadow'?: string
  '$white-space'?: string
  '$word-break'?: string
  '$overflow-wrap'?: string
}

const component = defineComponent<FontAttributes>((attrs, children) => {
  const props = useAttrs(attrs, [
    'size',
    'weight',
    'family',
    'color',
    'line-height',
    'letter-spacing',
    'background-color',
    'text-decoration',
    'text-align',
    'text-transform',
    'font-style',
    'word-spacing',
    'text-shadow',
    'white-space',
    'word-break',
    'overflow-wrap',
  ])
  const element = document.createElement('span')
  effect(() => {
    element.style.fontSize = (toValue(props.size) ?? 16).toString()
    element.style.fontWeight = toValue(props.weight) ?? 'normal'
    element.style.fontFamily = toValue(props.family) ?? 'sans-serif'
    element.style.color = toValue(props.color) ?? 'black'
    element.style.lineHeight = (toValue(props['line-height']) ?? 1.5).toString()
    element.style.letterSpacing = (toValue(props['letter-spacing']) ?? 0).toString()
    element.style.backgroundColor = toValue(props['background-color']) ?? 'transparent'
    element.style.textDecoration = toValue(props['text-decoration']) ?? 'none'
    element.style.textAlign = toValue(props['text-align']) ?? 'left'
    element.style.textTransform = toValue(props['text-transform']) ?? 'none'
    element.style.fontStyle = toValue(props['font-style']) ?? 'normal'
    element.style.wordSpacing = (toValue(props['word-spacing']) ?? 0).toString()
    element.style.textShadow = toValue(props['text-shadow']) ?? 'none'
    element.style.whiteSpace = toValue(props['white-space']) ?? 'normal'
    element.style.wordBreak = toValue(props['word-break']) ?? 'normal'
    element.style.overflowWrap = toValue(props['overflow-wrap']) ?? 'normal'
    element.append(...children())
  })

  animateWithAttrs(attrs, animation, element)()

  return element
})

builtins.set('font', component)
export default component
