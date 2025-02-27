import { builtins, defineComponent, effect, toValue, useAttrs } from "@eichjs/renderer"

export interface TableAttributes {
  $border: string
  '$border-width': number
}

const component = defineComponent<TableAttributes>((attrs, children) => {
  const { border, 'border-width': borderWidth } = useAttrs(attrs, ['border', 'border-width'])
  const table = document.createElement('table')
  effect(() => {
    table.style.border = toValue(border) ?? 'none'
    table.style.borderWidth = toValue(borderWidth) ?? '0'
  })
  table.append(...children())

  return table
})

builtins.set('table', component)
export default component
