import { defineResolver } from "../types";
import { EichContainerElement, container } from "./container";

export interface EichRowElement extends EichContainerElement {
  height?: number
}

export const row = defineResolver<EichRowElement>(({ widget, data }) => {
  const containerWidget = container({ widget, data })
  const row = document.createElement('div')
  row.style.display = 'flex'
  row.style.flexDirection = 'row'
  if (widget.height) {
    row.style.height = `${widget.height}px`
  }
  return { widget: row, data: containerWidget.data }
})
