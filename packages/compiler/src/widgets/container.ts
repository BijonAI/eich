import { defineEvaluater, EichElement, VElement } from "../types"
import { unref } from "@vue/reactivity"
import { MaybeRef } from "@vue/reactivity"

export interface EichContainerElement extends EichElement {
  attributes: {
    margin?: MaybeRef<number>
    padding?: MaybeRef<number>
    marginTop?: MaybeRef<number>
    marginRight?: MaybeRef<number>
    marginBottom?: MaybeRef<number>
    marginLeft?: MaybeRef<number>
    paddingTop?: MaybeRef<number>
    paddingRight?: MaybeRef<number>
    paddingBottom?: MaybeRef<number>
    paddingLeft?: MaybeRef<number>
    width?: MaybeRef<number>
    height?: MaybeRef<number>
    grow?: MaybeRef<number>
    align?: MaybeRef<'center' | 'left' | 'right'>
    baseline?: MaybeRef<'center' | 'top' | 'bottom'>
  }
}

export const container = defineEvaluater<EichContainerElement>(({ widget, context }) => {
  if (widget.tag !== 'container') return null
  const container: VElement = {
    tag: 'div',
    attributes: {
      style: 'display: flex;'
    },
    children: []
  }
  if (widget.attributes.marginBottom && widget.attributes.marginLeft && widget.attributes.marginRight && widget.attributes.marginTop) {
    container.attributes.style += ` margin: ${unref(widget.attributes.marginTop)} ${unref(widget.attributes.marginRight)} ${unref(widget.attributes.marginBottom)} ${unref(widget.attributes.marginLeft)};`
  } else if (widget.attributes.margin) {
    container.attributes.style += ` margin: ${unref(widget.attributes.margin)};`
  }
  if (widget.attributes.paddingBottom && widget.attributes.paddingLeft && widget.attributes.paddingRight && widget.attributes.paddingTop) {
    container.attributes.style += ` padding: ${widget.attributes.paddingTop} ${widget.attributes.paddingRight} ${widget.attributes.paddingBottom} ${widget.attributes.paddingLeft};`
  } else if (widget.attributes.padding) {
    container.attributes.style += ` padding: ${unref(widget.attributes.padding)};`
  }
  if (typeof widget.attributes.grow === 'undefined') {
    if (widget.attributes.width) {
      container.attributes.style += ` width: ${unref(widget.attributes.width)};`
    } else {
      container.attributes.style += ` width: 100%;`
    }
    if (widget.attributes.height) {
      container.attributes.style += ` height: ${unref(widget.attributes.height)};`
    } else {
      container.attributes.style += ` height: 100%;`
    }
  } else {
    if (widget.attributes.grow) {
      container.attributes.style += ` flex-grow: ${unref(widget.attributes.grow)};`
    } else if (widget.attributes.grow === undefined) {
      container.attributes.style += ` flex-grow: 1;`
    }
  }
  if (widget.attributes.align) {
    container.attributes.style += ` align-items: ${unref(widget.attributes.align) === 'left' ? 'flex-start' : unref(widget.attributes.align) === 'right' ? 'flex-end' : 'center'};`
  }
  if (widget.attributes.baseline) {
    container.attributes.style += ` justify-content: ${unref(widget.attributes.baseline) === 'top' ? 'flex-start' : unref(widget.attributes.baseline) === 'bottom' ? 'flex-end' : 'center'};`
  }
  return { widget: container, context }
})
