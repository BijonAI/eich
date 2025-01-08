import { EichElement } from "../types";
import { defineResolver } from "../types"

export const textContent = defineResolver<EichElement>(({ widget, data }) => {
  if (widget.tag !== 'text-content') return null
  return { widget: { tag: 'text-content', attributes: {
    content: widget.attributes.content ?? ''
  }, children: [] }, data }
})
