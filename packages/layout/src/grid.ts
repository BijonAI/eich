import { defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface GridAttributes {
  '$template-rows'?: string
  '$template-columns'?: string
  '$template-areas'?: string
  '$auto-flow'?: 'row' | 'column'
  '$auto-rows'?: string
  '$auto-columns'?: string
  '$row-gap'?: string
  '$column-gap'?: string
  '$gap'?: string
  '$grid'?: string
  '$align-content'?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'
  '$align-items'?: 'start' | 'end' | 'center' | 'stretch' | 'baseline'
  '$justify-content'?: 'start' | 'end' | 'center' | 'stretch' | 'space-around' | 'space-between' | 'space-evenly'
  '$justify-items'?: 'start' | 'end' | 'center' | 'stretch'
  '$place-content'?: string
  '$place-items'?: string
}

const component = defineComponent<GridAttributes>((attrs, children) => {
  const {
    'template-rows': templateRows,
    'template-columns': templateColumns,
    'template-areas': templateAreas,
    'auto-flow': autoFlow,
    'auto-rows': autoRows,
    'auto-columns': autoColumns,
    'row-gap': rowGap,
    'column-gap': columnGap,
    gap,
    grid,
    'align-content': alignContent,
    'align-items': alignItems,
    'justify-content': justifyContent,
    'justify-items': justifyItems,
    'place-content': placeContent,
    'place-items': placeItems,
  } = useAttrs(attrs, [
    'template-rows',
    'template-columns',
    'template-areas',
    'auto-flow',
    'auto-rows',
    'auto-columns',
    'row-gap',
    'column-gap',
    'gap',
    'grid',
    'align-content',
    'align-items',
    'justify-content',
    'justify-items',
    'place-content',
    'place-items',
  ])

  const gridElement = document.createElement('div')

  effect(() => {
    gridElement.style.display = 'grid'

    const gridValue = toValue(grid)
    if (gridValue) {
      gridElement.style.grid = gridValue
      return
    }

    gridElement.style.gridTemplateRows = toValue(templateRows) || ''
    gridElement.style.gridTemplateColumns = toValue(templateColumns) || ''
    gridElement.style.gridTemplateAreas = toValue(templateAreas) || ''

    gridElement.style.gridAutoFlow = toValue(autoFlow) || ''
    gridElement.style.gridAutoRows = toValue(autoRows) || ''
    gridElement.style.gridAutoColumns = toValue(autoColumns) || ''

    const gapValue = toValue(gap)
    if (gapValue) {
      gridElement.style.gap = gapValue
    }
    else {
      gridElement.style.rowGap = toValue(rowGap) || ''
      gridElement.style.columnGap = toValue(columnGap) || ''
    }

    const placeContentValue = toValue(placeContent)
    if (placeContentValue) {
      gridElement.style.placeContent = placeContentValue
    }
    else {
      gridElement.style.alignContent = toValue(alignContent) || ''
      gridElement.style.justifyContent = toValue(justifyContent) || ''
    }

    const placeItemsValue = toValue(placeItems)
    if (placeItemsValue) {
      gridElement.style.placeItems = placeItemsValue
    }
    else {
      gridElement.style.alignItems = toValue(alignItems) || ''
      gridElement.style.justifyItems = toValue(justifyItems) || ''
    }
  })

  gridElement.append(...children())
  return gridElement
})

export default component
