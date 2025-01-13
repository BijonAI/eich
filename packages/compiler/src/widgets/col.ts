import { defineEvaluater, defineWidget, VElement, Widget } from "../types";
import { cheat } from "../utils/cheat";
import { mergeObjects } from "../utils/merge";
import { EichContainerElement, container } from "./container";

export interface EichColElement extends EichContainerElement {
  attributes: {
    width?: number
  }
}

export const col = defineEvaluater<EichColElement>(async ({ widget, context }) => {
  if (widget.tag !== 'col') return null
  const widgetContainer = await cheat(container, widget, 'container') as Widget
  widgetContainer!.element!.style.width = `${widget.attributes.width}px`
  return defineWidget(mergeObjects(widgetContainer, {
    get width() {
      return widget.attributes.width!
    },
    set width(value: number) {
      widgetContainer!.element!.style.width = `${value}px`
      widget.attributes.width = value
    },
  }))
})
