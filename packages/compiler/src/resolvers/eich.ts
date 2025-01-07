import { EichElement } from "../types";
import { defineResolver } from "../types"

export const eich = defineResolver<EichElement>(({ widget, data }) => {
  if (widget.tag !== 'eich') return null
  return { widget: { tag: 'div', attributes: {}, children: [] }, data }
})
