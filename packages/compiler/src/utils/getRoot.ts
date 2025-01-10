import { EichElement } from "../types"

export function getRoot(element: EichElement): EichElement {
  while (element.parent) {
    element = element.parent
  }
  return element
}
