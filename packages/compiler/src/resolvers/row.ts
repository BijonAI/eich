import { defineResolver, VElement } from "../types";
import { cheat } from "../utils/cheat";
import { EichContainerElement, container } from "./container";

export interface EichRowElement extends EichContainerElement {
  attributes: {
    height?: number
  }
}

export const row = defineResolver<EichRowElement>(({ widget, context }) => {
  if (widget.tag !== 'row') return null
  const containerWidget = cheat(container, widget, 'container')
  const row: VElement = {
    tag: 'div',
    attributes: (containerWidget as { widget: VElement }).widget.attributes ?? { style: '' },
    children: []
  }
  row.attributes.style += ' flex-direction: row;'
  if (widget.attributes.height) {
    row.attributes.style += ` height: ${widget.attributes.height};`
  }
  return { widget: row, context }
})
