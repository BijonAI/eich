import { VElement } from "./types";

export function virtualize(element: Element): VElement {
  return {
    tag: element.tagName.toLowerCase(),
    attributes: Object.fromEntries([...element.attributes].map(attr => [attr.name, attr.value])),
    children: Array.from(element.children).map(child => virtualize(child as Element))
  }
}
