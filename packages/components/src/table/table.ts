import { defineComponent, effect, toValue, useAttrs } from "@eich/renderer"

export interface TableAttributes {
  $columns?: Array<number>
  $rows?: Array<number>
  $gutter?: number | string
  $align?: 'row' | 'column'
  '$column-gutter': number | string
  '$row-gutter': number | string
}

const component = defineComponent<TableAttributes>((props, children) => {
  const table = document.createElement('table')
  const kids = children()
  const amount = kids.length

  if (amount === 0) {
    return table
  }

  const { columns, rows, gutter, align, 'column-gutter': columnGutter, 'row-gutter': rowGutter } = useAttrs(props, ['columns', 'rows', 'gutter', 'align', 'column-gutter', 'row-gutter'])

  effect(() => {
    const shouldedContainer = align === 'row' ? 'tr' : 'td'
    const shouldedItem = shouldedContainer === 'tr' ? 'td' : 'tr'
    const shouldedItems = align === 'row' ? rows : columns
    let items = document.createElement(shouldedContainer)

    kids.forEach((kid, index) => {
      if (index >= Number(toValue(shouldedItems))) {
        table.appendChild(items)
        items = document.createElement(shouldedContainer)
      }
      const item = document.createElement(shouldedItem)
      item.appendChild(kid)
      items.appendChild(item)
    })
  })


  return table
})
