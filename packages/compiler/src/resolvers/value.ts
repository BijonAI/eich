import { defineResolver, EichElement } from "../types";

export interface EichValueElement extends EichElement {
  tag: 'value'
  attributes: {
    data: any
  }
}

export const valueResolver = defineResolver<EichValueElement>(({ widget, context }) => {
  const { data } = widget.attributes
  return {
    widget: {
      tag: 'text-content',
      attributes: {
        content: data
      },
      children: []
    },
    context,
  }
})
