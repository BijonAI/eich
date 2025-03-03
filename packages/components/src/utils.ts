import { toValue } from '@eichjs/renderer'

/**
 * Sets a style property on an HTML element if the value exists
 * @param element The HTML element to set the style on
 * @param styleKey The CSS property name
 * @param value The value to set (will be converted using toValue)
 */
export function setStyleIfExists(element: HTMLElement, styleKey: string, value: unknown) {
  const styleValue = toValue(value)
  if (styleValue) {
    element.style[styleKey as any] = styleValue as string
  }
}
