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
  const htmlNodes = computed(() => compileToHtml(strings.map((string, index) => {
    if (isRef(values[index])) return string + (values[index].value ?? '')
    return string + (values[index] ?? '')
  }).join('')) as HTMLElement[])
  return htmlNodes
}

export function resolveSlots(slots: ComputedRef<HTMLElement[]>[], htmlNodes: ComputedRef<HTMLElement[]>) {
  const resolvedSlots = computed(() => {
    const clonedHtmlNodes = htmlNodes.value.map(node => node.cloneNode(true)) as HTMLElement[]
    const result = clonedHtmlNodes.map(node => {
      const slotElements = [...(node as HTMLElement).getElementsByTagName('slot')]
      slots.map(slot => slot.value).flat().forEach((slot) => {
        if (slotElements.length === 0) return
        const parent = slotElements[0].parentElement
        if (parent) {
          parent.insertBefore(slot, slotElements[0])
          parent.removeChild(slotElements[0])
        }
      })
      return node
    })
    return result
  })
  return resolvedSlots
}
