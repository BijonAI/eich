import { defineEvaluater, defineWidget, VElement, Widget } from "../types";
import { cheat } from "../utils/cheat";
import { mergeObjects } from "../utils/merge";
import { container } from "./container";

export const col = defineEvaluater<'col', { width?: number }>(async ({ widget, context }) => {
  if (widget.tag !== 'col') return null
  const widgetContainer = await cheat(container, widget, 'container') as Widget & { element?: HTMLElement }
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
