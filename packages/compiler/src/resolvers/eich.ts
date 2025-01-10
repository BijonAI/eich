import { EichElement } from "../types";
import { defineResolver } from "../types"

export interface EichRootElement extends EichElement {
  attributes: {
    width?: number
    height?: number
  }
}

export const eich = defineResolver<EichRootElement>(({ widget, context }) => {
  if (widget.tag !== 'eich') return null
  const result = { widget: { tag: 'div', attributes: {
    style: `position: absolute;`
  }, children: [] }, context }
  if (widget.attributes.width) {
    result.widget.attributes.style += ` width: ${widget.attributes.width};`
  }
  if (widget.attributes.height) {
    result.widget.attributes.style += ` height: ${widget.attributes.height};`
  }
  return result
})


