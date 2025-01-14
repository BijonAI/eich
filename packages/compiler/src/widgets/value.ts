import { defineEvaluater, defineWidget, EichElement } from "../types";
export interface EichValueElement extends EichElement {
  tag: 'value'
  attributes: {
    data: any
  }
}

export const valueEvaluater = defineEvaluater<EichValueElement>(({ widget, context }) => {
  const { data } = widget.attributes
  const node = document.createTextNode(data)
  console.log('Processed value:', data)
  return defineWidget({
    ...widget,
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
