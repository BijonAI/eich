import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface TableAttributes {
  // Style attributes
  '$border': string
  '$border-width': number
  '$border-collapse': 'collapse' | 'separate'
  '$border-spacing': string
  '$width': string
  '$height': string
  '$caption-side': 'top' | 'bottom'

  // HTML attributes
  'align': 'left' | 'center' | 'right'
  'bgcolor': string
  'cellpadding': number | string
  'cellspacing': number | string
  'frame': 'void' | 'above' | 'below' | 'hsides' | 'vsides' | 'lhs' | 'rhs' | 'box' | 'border'
  'rules': 'none' | 'groups' | 'rows' | 'cols' | 'all'
  'summary': string
}

const component = defineComponent<TableAttributes>((attrs, children) => {
  const {
    border,
    'border-width': borderWidth,
    'border-collapse': borderCollapse,
    'border-spacing': borderSpacing,
    width,
    height,
    'caption-side': captionSide,
    align,
    bgcolor,
    cellpadding,
    cellspacing,
    frame,
    rules,
    summary,
  } = useAttrs(attrs, [
    'border',
    'border-width',
    'border-collapse',
    'border-spacing',
    'width',
    'height',
    'caption-side',
    'align',
    'bgcolor',
    'cellpadding',
    'cellspacing',
    'frame',
    'rules',
    'summary',
  ])

  const table = document.createElement('table')

  // Apply styles
  effect(() => {
    const borderValue = toValue(border)
    const borderWidthValue = toValue(borderWidth)

    if (borderValue) {
      table.style.border = borderValue
    }
    else {
      table.style.border = 'none'
    }

    // 只有在明确设置了 borderWidth 时才应用它
    if (borderWidthValue) {
      table.style.borderWidth = borderWidthValue
    }

    table.style.borderCollapse = toValue(borderCollapse) ?? 'separate'
    table.style.borderSpacing = toValue(borderSpacing) ?? '2px'
    table.style.width = toValue(width) ?? 'auto'
    table.style.height = toValue(height) ?? 'auto'
    table.style.captionSide = toValue(captionSide) ?? 'top'
  })

  // Apply HTML attributes
  effect(() => {
    const alignValue = toValue(align)
    if (alignValue)
      table.setAttribute('align', alignValue)
    else table.removeAttribute('align')

    const bgcolorValue = toValue(bgcolor)
    if (bgcolorValue)
      table.setAttribute('bgcolor', bgcolorValue)
    else table.removeAttribute('bgcolor')

    const cellpaddingValue = toValue(cellpadding)
    if (cellpaddingValue !== undefined)
      table.setAttribute('cellpadding', cellpaddingValue.toString())
    else table.removeAttribute('cellpadding')

    const cellspacingValue = toValue(cellspacing)
    if (cellspacingValue !== undefined)
      table.setAttribute('cellspacing', cellspacingValue.toString())
    else table.removeAttribute('cellspacing')

    const frameValue = toValue(frame)
    if (frameValue)
      table.setAttribute('frame', frameValue)
    else table.removeAttribute('frame')

    const rulesValue = toValue(rules)
    if (rulesValue)
      table.setAttribute('rules', rulesValue)
    else table.removeAttribute('rules')

    const summaryValue = toValue(summary)
    if (summaryValue)
      table.setAttribute('summary', summaryValue)
    else table.removeAttribute('summary')
  })

  table.append(...children())

  return table
})

builtins.set('table', component)
export default component
