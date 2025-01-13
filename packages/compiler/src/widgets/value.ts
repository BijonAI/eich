import { defineEvaluater, EichElement } from "../types";
import { MaybeRef, unref } from "@vue/reactivity";
export interface EichValueElement extends EichElement {
  tag: 'value'
  attributes: {
    data: MaybeRef<any>
  }
}

export const valueEvaluater = defineEvaluater<EichValueElement>(({ widget, context }) => {
  const { data } = widget.attributes
  return {
    widget: {
      tag: 'text-content',
      attributes: {
        content: unref(data)
      },
      children: []
    },
    context,
  }
})

const data = {
  _x: 3,
  y: 4,
  get x() {
    return this._x
  },
}
