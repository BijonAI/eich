import { defineResolver, defineEvaluater, EichElement, VElement } from "../types"

export const varResolver = defineResolver<'var', { key: string, value: unknown }>(async ({ widget, context }) => {
  if (widget.tag !== 'var') return null
  const { key, value } = widget.attributes
  await context.set!(key, typeof value === 'object' ? value : {
    type: 'ref',
    value
  }, context.data)
  return context
})

export const varEvaluater = defineEvaluater<'var', { key: string, value: unknown }>(async ({ widget, context }) => {
  if (widget.tag !== 'var') return null
  return []
})