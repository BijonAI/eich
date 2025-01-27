import { builtins, defineComponent, effect, toValue, useAttrs } from '@eich/renderer'

export interface ColumnsAttributes {
  $count: number
  $reverse: boolean
  $height: number
  $widths: string | Array<string>
}

const component = defineComponent<ColumnsAttributes>((attrs, children) => {
  const { columns = 2, reverse = false, gap = 0, align = 'stretch', height, widths } = useAttrs(attrs, ['columns', 'reverse', 'gap', 'align', 'height', 'widths'])
  const wrapper = document.createElement('div')
  const div = document.createElement('div')

  effect(() => {
    const widthString = Array.isArray(toValue(widths))
      ? (toValue(widths) as unknown as Array<string>).join(' ')
      : toValue(widths)
    div.style.columnCount = String(columns)
    div.style.columnGap = `${gap}px`
    div.style.maxHeight = height ? `${height}px` : 'none'

    wrapper.style.display = 'flex'
    wrapper.style.flexDirection = reverse ? 'column-reverse' : 'column'
    wrapper.style.gap = `${gap}px`
    wrapper.style.flex = widthString!

    const childrenElements = children()
    wrapper.append(...childrenElements)
  })

  div.appendChild(wrapper)
  return div
})

builtins.set('columns', component)
export default component