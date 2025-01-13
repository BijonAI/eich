import { EichElement } from "../types";
import { defineEvaluater } from "../types"
import { unref, MaybeRef } from "@vue/reactivity";

export interface EichRootElement extends EichElement {
  attributes: {
    width?: MaybeRef<number>
    height?: MaybeRef<number>
  }
}

export const eich = defineEvaluater<EichRootElement>(({ widget, context }) => {
  if (widget.tag !== 'eich') return null
  const result = { widget: { tag: 'div', attributes: {
    style: `position: absolute;`
  }, children: [] }, context }
  if (widget.attributes.width) {
    result.widget.attributes.style += ` width: ${unref(widget.attributes.width)};`
  }
  if (widget.attributes.height) {
    result.widget.attributes.style += ` height: ${unref(widget.attributes.height)};`
  }
  return result
})


