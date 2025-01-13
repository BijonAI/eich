import { EichElement } from "../types";
import { defineEvaluater } from "../types"

export const textContent = defineEvaluater<EichElement>(({ widget, context }) => {
  if (widget.tag !== 'text-content') return null
  return { widget: { tag: 'text-content', attributes: {
    content: widget.attributes.content ?? ''
  }, children: [] }, context }
})
