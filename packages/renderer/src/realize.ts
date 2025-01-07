import { VElement } from "@eich/compiler";

export function realize(widget: VElement, data: Record<string, any>) {
  if (typeof window !== 'undefined') {
    const node = document.createElement(widget.tag)
    for (const key in widget.attributes) {
      node.setAttribute(key, widget.attributes[key])
    }
    node.textContent = widget.children.map(child => realize(child, data)).join('')
    return node
  }
  let result = `<${widget.tag}`
  console.log(widget.attributes)
  for (const key in widget.attributes) {
    result += ` ${key}="${widget.attributes[key]}"`
  }
  result += `>${widget.children.map(child => realize(child, data)).join('')}</${widget.tag}>`
  return result
}
