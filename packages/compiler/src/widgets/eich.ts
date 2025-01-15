import { defineWidget, EichElement } from "../types";
import { defineEvaluater } from "../types"
  
export const eich = defineEvaluater<'eich', { width?: number, height?: number }>(({ widget, context }) => {
  if (widget.tag !== 'eich') return null
  const element = document.createElement('div')
  element.style.position = 'absolute'
  element.style.width = `${widget.attributes.width}px`
  element.style.height = `${widget.attributes.height}px`
  return defineWidget({
    get width() {
      return widget.attributes.width!
    },
    set width(value: number) {
      element.style.width = `${value}px`
      widget.attributes.width = value
    },
    get height() {
      return widget.attributes.height!
    },
    set height(value: number) {
      element.style.height = `${value}px`
      widget.attributes.height = value
    },
    element,
  })
})


