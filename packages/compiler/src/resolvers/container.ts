import { defineResolver, EichElement, VElement } from "../types"

export interface EichContainerElement extends EichElement {
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
}

export const container = defineResolver<EichContainerElement>(({ widget, data }) => {
  if (widget.tag !== 'container') return null
  const container: VElement = {
    tag: 'div',
    attributes: {},
    children: []
  }
  if (widget.marginBottom || widget.marginLeft || widget.marginRight || widget.marginTop) {
    container.attributes.style = `margin: ${widget.marginTop}px ${widget.marginRight}px ${widget.marginBottom}px ${widget.marginLeft}px`
  } else if (widget.margin) {
    container.attributes.style = `margin: ${widget.margin}px`
  }
  if (widget.paddingBottom || widget.paddingLeft || widget.paddingRight || widget.paddingTop) {
    container.attributes.style += `padding: ${widget.paddingTop}px ${widget.paddingRight}px ${widget.paddingBottom}px ${widget.paddingLeft}px`
  } else if (widget.padding) {
    container.attributes.style += `padding: ${widget.padding}px`
  }
  if (widget.width) {
    container.attributes.style += `width: ${widget.width}px`
  }
  if (widget.height) {
    container.attributes.style += `height: ${widget.height}px`
  }
  if (widget.grow) {
    container.attributes.style += `flex-grow: ${widget.grow}`
  }
  return { widget: container, data }
})
