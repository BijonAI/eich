import { defineEvaluater, defineWidget, VElement } from "../types";
import { cheat } from "../utils/cheat";
import { EichContainerElement, container } from "./container";

export interface EichColElement extends EichContainerElement {
  attributes: {
    width?: number
  }
}

export const col = defineEvaluater<EichColElement>(async ({ widget, context }) => {
  if (widget.tag !== 'col') return null
  const element = document.createElement('div')
  const widgetContainer = cheat(container, widget, 'container')
  element.style.width = `${widget.attributes.width}px`
  return defineWidget({
    ...widgetContainer,
    get width() {
      return widget.attributes.width!
    },
    set width(value: number) {
      element.style.width = `${value}px`
      widget.attributes.width = value
    }
  })
})
