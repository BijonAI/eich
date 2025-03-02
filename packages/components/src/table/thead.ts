import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface TheadAttributes {
  // HTML attributes
  align?: 'left' | 'center' | 'right'
  valign?: 'top' | 'middle' | 'bottom' | 'baseline'
  bgcolor?: string
  char?: string
  charoff?: string
}

const component = defineComponent<TheadAttributes>((attrs, children) => {
  const props = useAttrs(attrs, ['align', 'valign', 'bgcolor', 'char', 'charoff'])
  const thead = document.createElement('thead')

  effect(() => {
    const alignValue = toValue(props.align)
    if (alignValue)
      thead.setAttribute('align', alignValue)
    else thead.removeAttribute('align')

    const valignValue = toValue(props.valign)
    if (valignValue)
      thead.setAttribute('valign', valignValue)
    else thead.removeAttribute('valign')

    const bgcolorValue = toValue(props.bgcolor)
    if (bgcolorValue)
      thead.setAttribute('bgcolor', bgcolorValue)
    else thead.removeAttribute('bgcolor')

    const charValue = toValue(props.char)
    if (charValue)
      thead.setAttribute('char', charValue)
    else thead.removeAttribute('char')

    const charoffValue = toValue(props.charoff)
    if (charoffValue)
      thead.setAttribute('charoff', charoffValue)
    else thead.removeAttribute('charoff')
  })

  thead.append(...children())

  return thead
})

builtins.set('thead', component)
export default component
