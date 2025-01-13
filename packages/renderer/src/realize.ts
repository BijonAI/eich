import { VElement } from "@eich/compiler";

export function realize(widget: VElement) {
  console.log(widget)
  if (widget.tag === 'text-content') {
    console.log(widget.attributes.content)
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
