import { defineResolver, defineEvaluater, EichElement, VElement } from "../types"

export interface EichVarElement extends EichElement {
  tag: 'var'
  attributes: {
    key: string
    value: unknown
  }
}

export const varResolver = defineResolver<EichVarElement>(async ({ widget, context }) => {
  if (widget.tag !== 'var') return null
  
  const { key, value } = widget.attributes
  
  await context.set!(key, typeof value === 'object' ? value : {
    type: 'ref',
    value
  }, context.data)
  
  return context
})
