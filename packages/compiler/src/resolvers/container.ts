import { defineResolver, EichElement, VElement } from "../types"

export interface EichContainerElement extends EichElement {
  attributes: {
    margin?: number
    padding?: number
    marginTop?: number
    marginRight?: number
    marginBottom?: number
    marginLeft?: number
    paddingTop?: number
    paddingRight?: number
    paddingBottom?: number
    paddingLeft?: number
    width?: number
    height?: number
    grow?: number
    align?: 'center' | 'left' | 'right'
    baseline?: 'center' | 'top' | 'bottom'
  }
}

export const container = defineResolver<EichContainerElement>(({ widget, context }) => {
  if (widget.tag !== 'container') return null
  const container: VElement = {
    tag: 'div',
    attributes: {
      style: 'display: flex;'
    },
    children: []
  }
  if (widget.attributes.marginBottom || widget.attributes.marginLeft || widget.attributes.marginRight || widget.attributes.marginTop) {
    container.attributes.style += ` margin: ${widget.attributes.marginTop} ${widget.attributes.marginRight} ${widget.attributes.marginBottom} ${widget.attributes.marginLeft};`
  } else if (widget.attributes.margin) {
    container.attributes.style += ` margin: ${widget.attributes.margin};`
  }
  if (widget.attributes.paddingBottom || widget.attributes.paddingLeft || widget.attributes.paddingRight || widget.attributes.paddingTop) {
    container.attributes.style += ` padding: ${widget.attributes.paddingTop} ${widget.attributes.paddingRight} ${widget.attributes.paddingBottom} ${widget.attributes.paddingLeft};`
  } else if (widget.attributes.padding) {
    container.attributes.style += ` padding: ${widget.attributes.padding};`
  }
  if (typeof widget.attributes.grow === 'undefined') {
    if (widget.attributes.width) {
      container.attributes.style += ` width: ${widget.attributes.width};`
    } else {
      container.attributes.style += ` width: 100%;`
    }
    if (widget.attributes.height) {
      container.attributes.style += ` height: ${widget.attributes.height};`
    } else {
      container.attributes.style += ` height: 100%;`
    }
  } else {
    if (widget.attributes.grow) {
      container.attributes.style += ` flex-grow: ${widget.attributes.grow};`
    } else if (widget.attributes.grow === undefined) {
      container.attributes.style += ` flex-grow: 1;`
    }
  }
  if (widget.attributes.align) {
    container.attributes.style += ` align-items: ${widget.attributes.align === 'left' ? 'flex-start' : widget.attributes.align === 'right' ? 'flex-end' : 'center'};`
  }
  if (widget.attributes.baseline) {
    container.attributes.style += ` justify-content: ${widget.attributes.baseline === 'top' ? 'flex-start' : widget.attributes.baseline === 'bottom' ? 'flex-end' : 'center'};`
  }
  return { widget: container, context }
})
