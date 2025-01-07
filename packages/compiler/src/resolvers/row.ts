import { defineResolver, VElement } from "../types";
import { EichContainerElement, container } from "./container";

export interface EichRowElement extends EichContainerElement {
  height?: number
}

export const row = defineResolver<EichRowElement>(({ widget, data }) => {
  if (widget.tag !== 'row') return null
  const containerWidget = container({ widget, data })
  const row: VElement = {
    tag: 'div',
    attributes: {},
    children: []
  }
  row.attributes.style = 'display: flex; flex-direction: row;'
  if (widget.height) {
    row.attributes.style += `height: ${widget.height}px;`
  }
  return { widget: row, data: containerWidget?.data ?? {} }
})
