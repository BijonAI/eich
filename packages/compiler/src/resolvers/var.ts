import { definePresolver, defineResolver, EichElement, VElement } from "../types"
import { getRoot } from "../utils/getRoot"

export interface EichVarElement extends EichElement {
  tag: 'var'
  attributes: {
    key: string
    value: string
  }
}

export const varPresolver = definePresolver<EichVarElement>(({ widget, context }) => {
  if (widget.tag !== 'var') return null
  
  const { key, value } = widget.attributes
  
  context.global[key] = value
  
  return context
})

export const varResolver = defineResolver<EichVarElement>(({ widget, context }) => {
  if (widget.tag !== 'var') return null
  return { widget: { tag: 'div', attributes: {
    style: `position: absolute;`
  }, children: [] }, context }
})
