import { defineEvaluater, VElement } from "../types";
import { cheat } from "../utils/cheat";
import { unref, MaybeRef } from "@vue/reactivity";
import { EichContainerElement, container } from "./container";

export interface EichColElement extends EichContainerElement {
  attributes: {
    width?: MaybeRef<number>
  }
}

export const col = defineEvaluater<EichColElement>(async ({ widget, context }) => {
  if (widget.tag !== 'col') return null
  const containerWidget = cheat(container, widget, 'container')
  const col: VElement = {
    tag: 'div',
    attributes: (await containerWidget)?.widget.attributes ?? { style: '' },
    children: []
  }
  col.attributes.style += ' display: flex; flex-direction: column;'
  if (widget.attributes.width) {
    col.attributes.style += ` width: ${unref(widget.attributes.width)};`
  }
  return { widget: col, context }
})
