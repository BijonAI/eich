import { definePresolver, defineResolver, EichElement, VElement } from "../types"
import { getRoot } from "../utils/getRoot"

export interface EichVarElement extends EichElement {
  tag: 'var'
  attributes: {
    key: string
    value: {
      type: 'expression'
      value: string
    } | string
  }
}

export const varPresolver = definePresolver<EichVarElement>(({ widget, context }) => {
  if (widget.tag !== 'var') return null
  
  const { key, value } = widget.attributes
  
  context.global[key] = typeof value === 'object' ? value : {
    type: 'expression',
    value: value
  }
  
  return context
})

export const varResolver = defineResolver<EichVarElement>(({ widget, context }) => {
  if (widget.tag !== 'var') return null
  return null
})
