import { MaybeRef, unref } from "@vue/reactivity";
import { defineEvaluater, defineWidget, VElement } from "../types";
import { cheat } from "../utils/cheat";
import { EichContainerElement, container } from "./container";

export interface EichRowElement extends EichContainerElement {
  attributes: {
    height?: number
  }
}

export const row = defineEvaluater<EichRowElement>(({ widget, context }) => {
  if (widget.tag !== 'row') return null
  const containerWidget = cheat(container, widget, 'container')
  const element = document.createElement('div')
  element.style.display = 'flex'
  element.style.flexDirection = 'row'
  element.style.height = `${widget.attributes.height}px`
  return defineWidget({
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
})
