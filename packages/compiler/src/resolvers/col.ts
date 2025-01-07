import { defineResolver, VElement } from "../types";
import { EichContainerElement, container } from "./container";

export interface EichColElement extends EichContainerElement {
  width?: number
}

export const col = defineResolver<EichColElement>(({ widget, data }) => {
  if (widget.tag !== 'col') return null
  const containerWidget = container({ widget, data })
  const col: VElement = {
    tag: 'div',
    attributes: {},
    children: []
  }
  col.attributes.style = 'display: flex; flex-direction: column;'
  if (widget.width) {
    col.attributes.style += `width: ${widget.width}px;`
  }
  return { widget: col, data: containerWidget?.data ?? {} }
})
