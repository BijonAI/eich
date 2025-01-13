import { defineEvaluater, defineResolver, EichElement } from "../types"
import { unref, MaybeRef } from "@vue/reactivity"

export interface EichRefElement extends EichElement {
  tag: 'ref'
  attributes: {
    key: string
    value: MaybeRef<unknown>
  }
}

export const refResolver = defineResolver<EichRefElement>(async ({ widget, context }) => {
  if (widget.tag !== 'ref') return null
  const { key, value } = widget.attributes
  await context.set!(key, typeof value === 'object' ? value : {
    type: 'ref',
    value: unref(value)
  }, context.data)
  return context
})
