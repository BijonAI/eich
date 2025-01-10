import { VElement } from "@eich/compiler";

export function realize(widget: VElement) {
  if (typeof window !== 'undefined') {
    if (widget.tag === 'text-content') {
      return document.createTextNode(widget.attributes.content ?? '')
    }
    const node = document.createElement(widget.tag)
    for (const key in widget.attributes) {
      if (widget.attributes[key] !== undefined) {
        node.setAttribute(key, widget.attributes[key])
      }
    }
    node.textContent = widget.children.map(child => realize(child)).join('')
    return node
  }
  if (widget.tag === 'text-content') {
    return widget.attributes.content ?? ''
  }
  let result = `<${widget.tag}`
  if (widget.tag !== 'text-content') {
    for (const key in widget.attributes) {
      if (widget.attributes[key] !== undefined) {
        result += ` ${key}="${widget.attributes[key]}"`
      }
    }
  }
  result += `>${widget.children.map(child => realize(child)).join('')}</${widget.tag}>`
  return result
}
