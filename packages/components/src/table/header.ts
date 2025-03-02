import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface HeaderAttributes {
  $height: number
}

const component = defineComponent<HeaderAttributes>((attrs, children) => {
  const { height } = useAttrs(attrs, ['height'])
  const header = document.createElement('thead')
  const tr = document.createElement('tr')
  header.appendChild(tr)
  const kids = children()
  kids.forEach((kid) => {
    const td = document.createElement('td')
    td.appendChild(kid)
    tr.appendChild(td)
  })
  effect(() => {
    header.style.height = toValue(height) ?? '0'
  })

  return header
})

builtins.set('header', component)
export default component
