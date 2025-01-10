import { defineResolver, VElement } from "../types";
import { cheat } from "../utils/cheat";
import { EichContainerElement, container } from "./container";

export interface EichColElement extends EichContainerElement {
  attributes: {
    width?: number
  }
}

export const col = defineResolver<EichColElement>(({ widget, context }) => {
  if (widget.tag !== 'col') return null
  const containerWidget = cheat(container, widget, 'container')
  const col: VElement = {
    tag: 'div',
    attributes: containerWidget?.widget.attributes ?? { style: '' },
    children: []
  }
  col.attributes.style += ' display: flex; flex-direction: column;'
  if (widget.attributes.width) {
    col.attributes.style += ` width: ${widget.attributes.width};`
  }
  return { widget: col, context }
})
