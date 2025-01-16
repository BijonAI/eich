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

export function reactiveHtml(strings: TemplateStringsArray, ...values: MaybeRef<any>[]) {
  return computed(() => compileToHtml(strings.map((string, index) => {
    if (isRef(values[index])) return string + (values[index].value ?? '')
    return string + (values[index] ?? '')
  }).join('')) as HTMLElement[])
}

export function resolveSlots(slots: ComputedRef<HTMLElement[]>[], htmlNodes: ComputedRef<HTMLElement[]>) {
  return computed(() => {
    const clonedHtmlNodes = htmlNodes.value.map(node => node.cloneNode(true)) as HTMLElement[]
    const slotElements: HTMLSlotElement[] = []
    clonedHtmlNodes.forEach((node) => slotElements.push(...(node as HTMLElement).getElementsByTagName('slot')))
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
    return clonedHtmlNodes
  })
}

