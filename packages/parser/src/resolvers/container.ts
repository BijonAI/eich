import { defineResolver, EichElement } from "../types"

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
  const container = document.createElement('div')
  if (widget.marginBottom || widget.marginLeft || widget.marginRight || widget.marginTop) {
    container.style.margin = `${widget.marginTop}px ${widget.marginRight}px ${widget.marginBottom}px ${widget.marginLeft}px`
  } else if (widget.margin) {
    container.style.margin = `${widget.margin}px`
  }
  if (widget.paddingBottom || widget.paddingLeft || widget.paddingRight || widget.paddingTop) {
    container.style.padding = `${widget.paddingTop}px ${widget.paddingRight}px ${widget.paddingBottom}px ${widget.paddingLeft}px`
  } else if (widget.padding) {
    container.style.padding = `${widget.padding}px`
  }
  if (widget.width) {
    container.style.width = `${widget.width}px`
  }
  if (widget.height) {
    container.style.height = `${widget.height}px`
  }
  if (widget.grow) {
    container.style.flexGrow = `${widget.grow}`
  }
  return { widget: container, data }
})
