import { defineEvaluater, defineWidget, EichElement, VElement } from "../types"

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

export const container = defineEvaluater<EichContainerElement>(async ({ widget, context }) => {
  if (widget.tag !== 'container') return null
  const element = document.createElement('div')
  element.style.margin = `${widget.attributes.margin}px`
  element.style.padding = `${widget.attributes.padding}px`
  element.style.marginTop = `${widget.attributes.marginTop}px`
  element.style.marginRight = `${widget.attributes.marginRight}px`
  element.style.marginBottom = `${widget.attributes.marginBottom}px`
  element.style.marginLeft = `${widget.attributes.marginLeft}px`
  element.style.paddingTop = `${widget.attributes.paddingTop}px`
  element.style.paddingRight = `${widget.attributes.paddingRight}px`
  element.style.paddingBottom = `${widget.attributes.paddingBottom}px`
  element.style.paddingLeft = `${widget.attributes.paddingLeft}px`
  element.style.width = `${widget.attributes.width}px`
  element.style.height = `${widget.attributes.height}px`
  element.style.flexGrow = `${widget.attributes.grow}`
  element.style.alignItems = widget.attributes.align === 'center' ? 'center' : widget.attributes.align === 'left' ? 'flex-start' : 'flex-end'
  element.style.justifyContent = widget.attributes.baseline === 'center' ? 'center' : widget.attributes.baseline === 'top' ? 'flex-start' : 'flex-end'
  return defineWidget({
    element,

    get margin() { return widget.attributes.margin! },
    get padding() { return widget.attributes.padding! },
    get marginTop() { return widget.attributes.marginTop! },
    get marginRight() { return widget.attributes.marginRight! },
    get marginBottom() { return widget.attributes.marginBottom! },
    get marginLeft() { return widget.attributes.marginLeft! },
    get paddingTop() { return widget.attributes.paddingTop! },
    get paddingRight() { return widget.attributes.paddingRight! },
    get paddingBottom() { return widget.attributes.paddingBottom! },
    get paddingLeft() { return widget.attributes.paddingLeft! },
    get width() { return widget.attributes.width! },
    get height() { return widget.attributes.height! },
    get grow() { return widget.attributes.grow! },
    get align() { return widget.attributes.align! },
    get baseline() { return widget.attributes.baseline! },

    set margin(value: number) { 
      element.style.margin = `${value}px`
      widget.attributes.margin = value 
    },
    set padding(value: number) { 
      element.style.padding = `${value}px`
      widget.attributes.padding = value 
    },
    set marginTop(value: number) { 
      element.style.marginTop = `${value}px`
      widget.attributes.marginTop = value 
    },
    set marginRight(value: number) { 
      element.style.marginRight = `${value}px`
      widget.attributes.marginRight = value 
    },
    set marginBottom(value: number) { 
      element.style.marginBottom = `${value}px`
      widget.attributes.marginBottom = value 
    },
    set marginLeft(value: number) { 
      element.style.marginLeft = `${value}px`
      widget.attributes.marginLeft = value 
    },
    set paddingTop(value: number) { 
      element.style.paddingTop = `${value}px`
      widget.attributes.paddingTop = value 
    },
    set paddingRight(value: number) { 
      element.style.paddingRight = `${value}px`
      widget.attributes.paddingRight = value 
    },
    set paddingBottom(value: number) { 
      element.style.paddingBottom = `${value}px`
      widget.attributes.paddingBottom = value 
    },
    set paddingLeft(value: number) { 
      element.style.paddingLeft = `${value}px`
      widget.attributes.paddingLeft = value 
    },
    set width(value: number) { 
      element.style.width = `${value}px`
      widget.attributes.width = value 
    },
    set height(value: number) { 
      element.style.height = `${value}px`
      widget.attributes.height = value 
    },
    set grow(value: number) { 
      element.style.flexGrow = `${value}`
      widget.attributes.grow = value 
    },
    set align(value: 'center' | 'left' | 'right') { 
      element.style.alignItems = value === 'center' ? 'center' : value === 'left' ? 'flex-start' : 'flex-end'
      widget.attributes.align = value 
    },
    set baseline(value: 'center' | 'top' | 'bottom') { 
      element.style.justifyContent = value === 'center' ? 'center' : value === 'top' ? 'flex-start' : 'flex-end'
      widget.attributes.baseline = value 
    },
  })
})

