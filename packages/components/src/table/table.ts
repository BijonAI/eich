import {
  builtins,
  defineComponent,
  toValue,
  useAttrs,
  watch
} from '@eichjs/renderer'

export interface TableAttributes {
  // Basic style attributes
  '$border': CSSStyleDeclaration['border']
  '$width': CSSStyleDeclaration['width']
  '$height': CSSStyleDeclaration['height']
  '$border-width': CSSStyleDeclaration['borderWidth']
  '$border-style': CSSStyleDeclaration['borderStyle']
  '$border-color': CSSStyleDeclaration['borderColor']

  // Table layout attributeks
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

  table.style.width = toValue(width) ?? ''
  table.style.height = toValue(height) ?? ''
  table.style.border = toValue(border) ?? ''
  table.style.borderWidth = toValue(borderWidth) ?? ''
  table.style.borderStyle = toValue(borderStyle) ?? ''
  table.style.borderColor = toValue(borderColor) ?? ''
  table.style.borderCollapse = toValue(borderCollapse) ?? ''
  table.style.borderSpacing = toValue(borderSpacing) ?? ''
  table.style.captionSide = toValue(captionSide) ?? ''
  table.style.emptyCells = toValue(emptyCells) ?? ''
  table.style.tableLayout = toValue(tableLayout) ?? ''
  table.style.verticalAlign = toValue(verticalAlign) ?? ''
  table.style.textAlign = toValue(textAlign) ?? ''
  table.style.backgroundColor = toValue(backgroundColor) ?? ''
  table.style.color = toValue(color) ?? ''
  table.style.padding = toValue(padding) ?? ''
  table.style.borderRadius = toValue(borderRadius) ?? ''
  table.style.boxShadow = toValue(boxShadow) ?? ''

  watch(()=> toValue(width), (newValue) => {
    table.style.width = newValue ?? ''
  })

  watch(()=> toValue(height), (newValue) => {
    table.style.height = newValue ?? ''
  })

  watch(()=> toValue(border), (newValue) => {
    table.style.border = newValue ?? ''
  })

  watch(()=> toValue(borderWidth), (newValue) => {
    table.style.borderWidth = newValue ?? ''
  })

  watch(()=> toValue(borderStyle), (newValue) => {
    table.style.borderStyle = newValue ?? ''
  })

  watch(()=> toValue(borderColor), (newValue) => {
    table.style.borderColor = newValue ?? ''
  })


  watch(()=> toValue(borderCollapse), (newValue) => {
    table.style.borderCollapse = newValue ?? ''
  })

  watch(()=> toValue(borderSpacing), (newValue) => {
    table.style.borderSpacing = newValue ?? ''
  })

  watch(()=> toValue(captionSide), (newValue) => {
    table.style.captionSide = newValue ?? ''
  })

  watch(()=> toValue(emptyCells), (newValue) => {
    table.style.emptyCells = newValue ?? ''
  })

  watch(()=> toValue(tableLayout), (newValue) => {
    table.style.tableLayout = newValue ?? ''
  })

  watch(()=> toValue(verticalAlign), (newValue) => {
    table.style.verticalAlign = newValue ?? ''
  })

  watch(()=> toValue(textAlign), (newValue) => {
    table.style.textAlign = newValue ?? ''
  })

  watch(()=> toValue(backgroundColor), (newValue) => {
    table.style.backgroundColor = newValue ?? ''
  })

  watch(()=> toValue(color), (newValue) => {
    table.style.color = newValue ?? ''
  })

  watch(()=> toValue(padding), (newValue) => {
    table.style.padding = newValue ?? ''
  })

  watch(()=> toValue(borderRadius), (newValue) => {
    table.style.borderRadius = newValue ?? ''
  })

  watch(()=> toValue(boxShadow), (newValue) => {
    table.style.boxShadow = newValue ?? ''
  })

  table.append(...children())

  return table
})

builtins.set('table', component)
export default component
