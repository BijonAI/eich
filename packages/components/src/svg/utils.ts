import { toValue } from '@eichjs/renderer'

/**
 * Sets an attribute on an SVG element if the value exists, removes it otherwise
 * @param element The SVG element to set the attribute on
 * @param name The name of the attribute
 * @param value The value to set
 */
export function setAttributeIfExists(element: SVGElement, name: string, value: unknown) {
  const resolvedValue = toValue(value)
  if (resolvedValue) {
    element.setAttribute(name, resolvedValue.toString())
  }
  else {
    element.removeAttribute(name)
  }
}
