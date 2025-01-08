import { defineResolver, VElement } from "../types";
import { cheat } from "../utils/cheat";
import { EichContainerElement, container } from "./container";

export interface EichRowElement extends EichContainerElement {
  attributes: {
    height?: number
  }
}

export const row = defineResolver<EichRowElement>(({ widget, data }) => {
  if (widget.tag !== 'row') return null
  const containerWidget = cheat(container, widget, 'container')
  const row: VElement = {
    tag: 'div',
    attributes: containerWidget?.widget.attributes ?? { style: '' },
    children: []
  }
  row.attributes.style += ' display: flex; flex-direction: row;'
  if (widget.attributes.height) {
    row.attributes.style += ` height: ${widget.attributes.height};`
  }
  return { widget: row, data: containerWidget?.data ?? {} }
})
