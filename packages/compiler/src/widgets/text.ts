import { defineWidget, EichElement } from "../types";
import { defineEvaluater } from "../types"

export const textContent = defineEvaluater<EichElement>(({ widget, context }) => {
  if (widget.tag !== 'text-content') return null
  const node = document.createTextNode(widget.attributes.content ?? '')
  return defineWidget({
    ...widget,
    element: node,
    get content() {
      return widget.attributes.content!
    },
    set content(value: string) {
      node.textContent = value
      widget.attributes.content = value
    },
  })
})
