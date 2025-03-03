import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'
import { setStyleIfExists } from '../utils'

export interface TableAttributes {
  // Basic style attributes
  '$border': string
  '$width': string
  '$height': string
  '$border-width': number
  '$border-style': string
  '$border-color': string

  // Table layout attributes
  '$border-collapse': 'collapse' | 'separate'
  '$border-spacing': string
  '$caption-side': 'top' | 'bottom'
  '$empty-cells': 'show' | 'hide'
  '$table-layout': 'auto' | 'fixed'

  // Alignment and text attributes
  '$vertical-align': 'top' | 'middle' | 'bottom'
  '$text-align': 'left' | 'center' | 'right'

  // Color and appearance attributes
  '$background-color': string
  '$color': string
  '$padding': string
  '$border-radius': string
  '$box-shadow': string
}

const component = defineComponent<TableAttributes>((attrs, children) => {
  const {
    border,
    'border-width': borderWidth,
    'border-style': borderStyle,
    'border-color': borderColor,
    'border-collapse': borderCollapse,
    'border-spacing': borderSpacing,
    'border-radius': borderRadius,
    width,
    height,
    'caption-side': captionSide,
    'empty-cells': emptyCells,
    'table-layout': tableLayout,
    'vertical-align': verticalAlign,
    'text-align': textAlign,
    'background-color': backgroundColor,
    color,
    padding,
    'box-shadow': boxShadow,
  } = useAttrs(attrs, [
    'border',
    'border-width',
    'border-style',
    'border-color',
    'border-collapse',
    'border-spacing',
    'border-radius',
    'width',
    'height',
    'caption-side',
    'empty-cells',
    'table-layout',
    'vertical-align',
    'text-align',
    'background-color',
    'color',
    'padding',
    'box-shadow',
  ])

  const table = document.createElement('table')

  // Apply styles
  effect(() => {
    const borderValue = toValue(border)

    if (borderValue) {
      table.style.border = borderValue
    }
    else {
      // 处理单独的边框属性
      setStyleIfExists(table, 'borderWidth', borderWidth)
      setStyleIfExists(table, 'borderStyle', borderStyle)
      setStyleIfExists(table, 'borderColor', borderColor)
    }

    // 表格布局属性
    setStyleIfExists(table, 'borderCollapse', borderCollapse)
    setStyleIfExists(table, 'borderSpacing', borderSpacing)
    setStyleIfExists(table, 'width', width)
    setStyleIfExists(table, 'height', height)
    setStyleIfExists(table, 'captionSide', captionSide)
    setStyleIfExists(table, 'emptyCells', emptyCells)
    setStyleIfExists(table, 'tableLayout', tableLayout)

    // 对齐与文本属性
    setStyleIfExists(table, 'verticalAlign', verticalAlign)
    setStyleIfExists(table, 'textAlign', textAlign)

    // 颜色与外观属性
    setStyleIfExists(table, 'backgroundColor', backgroundColor)
    setStyleIfExists(table, 'color', color)
    setStyleIfExists(table, 'padding', padding)
    setStyleIfExists(table, 'borderRadius', borderRadius)
    setStyleIfExists(table, 'boxShadow', boxShadow)
  })

  table.append(...children())

  return table
})

builtins.set('table', component)
export default component
