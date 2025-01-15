import { defineEvaluater, defineWidget } from "../types";

export const valueEvaluater = defineEvaluater<'value', { data: any }>(({ widget, context }) => {
  const { data } = widget.attributes
  const node = document.createTextNode(data)
  return defineWidget({
    element: node,
    get content() {
      return data
    },
    set content(value: any) {
      node.textContent = value
      widget.attributes.data = value
    },
  })
})
