import { defineResolver } from "../types";
import { EichContainerElement, container } from "./container";

export interface EichColElement extends EichContainerElement {
  width?: number
}

export const col = defineResolver<EichColElement>(({ widget, data }) => {
  const containerWidget = container({ widget, data })
  const col = document.createElement('div')
  col.style.display = 'flex'
  col.style.flexDirection = 'column'
  if (widget.width) {
    col.style.width = `${widget.width}px`
  }
  return { widget: col, data: containerWidget.data }
})
