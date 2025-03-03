import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface TableAttributes {
  // Basic style attributes
  '$border': CSSStyleDeclaration['border']
  '$width': CSSStyleDeclaration['width']
  '$height': CSSStyleDeclaration['height']
  '$border-width': CSSStyleDeclaration['borderWidth']
  '$border-style': CSSStyleDeclaration['borderStyle']
  '$border-color': CSSStyleDeclaration['borderColor']

  // Table layout attributes
  '$border-collapse': CSSStyleDeclaration['borderCollapse']
  '$border-spacing': CSSStyleDeclaration['borderSpacing']
  '$caption-side': CSSStyleDeclaration['captionSide']
  '$empty-cells': CSSStyleDeclaration['emptyCells']
  '$table-layout': CSSStyleDeclaration['tableLayout']

  // Alignment and text attributes
  '$vertical-align': CSSStyleDeclaration['verticalAlign']
  '$text-align': CSSStyleDeclaration['textAlign']

  // Color and appearance attributes
  '$background-color': CSSStyleDeclaration['backgroundColor']
  '$color': CSSStyleDeclaration['color']
  '$padding': CSSStyleDeclaration['padding']
  '$border-radius': CSSStyleDeclaration['borderRadius']
  '$box-shadow': CSSStyleDeclaration['boxShadow']
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
      table.style.borderWidth = toValue(borderWidth) ?? ''
      table.style.borderStyle = toValue(borderStyle) ?? ''
      table.style.borderColor = toValue(borderColor) ?? ''
    }

    // 表格布局属性
    table.style.borderCollapse = toValue(borderCollapse) ?? ''
    table.style.borderSpacing = toValue(borderSpacing) ?? ''
    table.style.width = toValue(width) ?? ''
    table.style.height = toValue(height) ?? ''
    table.style.captionSide = toValue(captionSide) ?? ''
    table.style.emptyCells = toValue(emptyCells) ?? ''
    table.style.tableLayout = toValue(tableLayout) ?? ''

    // 对齐与文本属性
    table.style.verticalAlign = toValue(verticalAlign) ?? ''
    table.style.textAlign = toValue(textAlign) ?? ''

    // 颜色与外观属性
    table.style.backgroundColor = toValue(backgroundColor) ?? ''
    table.style.color = toValue(color) ?? ''
    table.style.padding = toValue(padding) ?? ''
    table.style.borderRadius = toValue(borderRadius) ?? ''
    table.style.boxShadow = toValue(boxShadow) ?? ''
  })

  table.append(...children())

  return table
})

builtins.set('table', component)
export default component
