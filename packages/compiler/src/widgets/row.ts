import { defineEvaluater, defineWidget } from "../types";
import { cheat } from "../utils/cheat";
import { container } from "./container";

export const row = defineEvaluater<'row', { height?: number }>(({ widget, context }) => {
  if (widget.tag !== 'row') return null
  const containerWidget = cheat(container, widget, 'container')
  const element = document.createElement('div')
  element.style.display = 'flex'
  element.style.flexDirection = 'row'
  element.style.height = `${widget.attributes.height}px`
  const rowWidget = defineWidget({
    ...containerWidget,
    element,
    get height() {
      return widget.attributes.height!
    },
    set height(value: number) {
      element.style.height = `${value}px`
      widget.attributes.height = value
    },
  })
  console.log('rowWidget', rowWidget)
  return rowWidget
})
