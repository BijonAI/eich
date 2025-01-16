import { computed, MaybeRef, isRef, Ref, ref, ComputedRef, watch } from "@vue/reactivity";

export type MaybeArray<T> = T | T[];
export type MaybePromise<T> = T | Promise<T>;
export type MaybeNull<T> = T | null;
export type CommonRecord<T> = Record<string, T>;

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function compileToHtml(htmlString: string) {
  const element = document.createElement('div')
  element.innerHTML = htmlString
  return [...element.childNodes]
}

export function template(strings: TemplateStringsArray, ...values: MaybeRef<any>[]) {
  return computed(() => compileToHtml(strings.map((string, index) => {
    if (isRef(values[index])) return string + (values[index].value ?? '')
    return string + (values[index] ?? '')
  }).join('')) as HTMLElement[])
}

export function resolveSlots(slots: ComputedRef<HTMLElement[]>[], htmlNodes: ComputedRef<HTMLElement[]>) {
  return computed(() => {
    const clonedHtmlNodes = htmlNodes.value.map(node => node.cloneNode(true)) as HTMLElement[]
    const slotElements: HTMLSlotElement[] = []
    const slotParentIfItIsRoot = document.createElement('div')
    clonedHtmlNodes.forEach((node) => {
      if (node instanceof HTMLSlotElement) {
        slotParentIfItIsRoot.appendChild(node)
        slotElements.push(node)
      } else {
        slotElements.push(...(node as HTMLElement).getElementsByTagName('slot'))
      }
    })
    for (const slotElement of slotElements) {
      for (const slot of slots) {
        if (slot.value && slot.value.length > 0) {
          for (const minifiedSlot of slot.value) {
            if (minifiedSlot && slotElement && slotElement.parentElement) {
              slotElement.parentElement?.insertBefore(minifiedSlot, slotElement)
            }
          }
          slotElement.parentElement?.removeChild(slotElement)
        }
      }
    }
    clonedHtmlNodes.push(...[...slotParentIfItIsRoot.children] as HTMLElement[])
    return clonedHtmlNodes
  })
}

export function convertToSnakeCase(str: string) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase()
}
export function convertToCamelCase(str: string) {
  return str.replace(/-([a-z])/g, (match, p1) => p1.toUpperCase())
}

export function style<T extends CommonRecord<any>>(styles: T, prefixers: {
  [K in keyof T]?: string | (() => string | undefined)
} & CommonRecord<string | (() => string | undefined)> = {}) {
  return computed(() => Object.entries({
    ...prefixers,
    ...styles
  }).filter(([_, value]) => typeof value !== 'undefined' ? typeof value === 'function' ? value() !== undefined : true : false).map(([key, value]) => `${convertToSnakeCase(key)}: ${typeof value === 'function' ? value() : value}`).join(';'))
}

export function props<T extends CommonRecord<any>>(props: T, prefixers: {
  [K in keyof T]?: string | (() => string | undefined)
} & CommonRecord<string | (() => string | undefined)> = {}) {
  return computed(() => Object.entries({
    ...prefixers,
    ...props
  }).filter(([_, value]) => typeof value !== 'undefined' ? typeof value === 'function' ? value() !== undefined : true : false).map(([key, value]) => `${convertToSnakeCase(key)}="${typeof value === 'function' ? value() : value}"`).join(' '))
}
