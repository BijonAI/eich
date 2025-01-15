import { computed, ComputedRef, watch } from "@vue/reactivity";
import { Context, getActiveContext, runInContext } from "./context";
import { EichBasicNode } from "./node";
import { CommonRecord, MaybeNull } from "./utils";

export function processAttrs(attrs: CommonRecord<string>) {
  return Object.fromEntries(
    Object.keys(attrs).map(key => {
      if (key.startsWith('$')) return [key.slice(1), runInContext(attrs[key], getActiveContext())]
      if (key.startsWith('@')) return [key, runInContext(`() => (${attrs[key]})`, getActiveContext())]
      return [key, attrs[key]]
    })
  )
}

export const RegistryComponent = {
  intrinsics: new Map<string, Component<any>>(),
  register(name: string, component: Component<any>) {
    this.intrinsics.set(name, component)
  },
  get(name: string) {
    return this.intrinsics.get(name)
  },
  has(name: string) {
    return this.intrinsics.has(name)
  }
}

export type Component<T extends EichBasicNode> = (props: T['props'], slots: () => ComputedRef<string>[]) => (context: Context) => MaybeNull<ComputedRef<string>>

export function defineComponent<T extends EichBasicNode>(component: Component<T>) {
  return component
}

export function renderToString(node: EichBasicNode): ComputedRef<string> {
  if (RegistryComponent.has(node.tag)) {
    const component = RegistryComponent.get(node.tag)
    if (!component) {
      console.warn(`Component ${node.tag} not found`)
    }
    const processedAttrs = processAttrs(node.props)
    const maybeNode = component && component(processedAttrs, () => node.children.map(child => renderToString(child)))(getActiveContext())

    if (maybeNode && maybeNode !== null) return maybeNode
    else return computed(() => '')
  }
  return computed(() => '')
}

export function render(node: EichBasicNode) {
  const htmlNode = renderToString(node)
  if (htmlNode && htmlNode !== null) {
    watch(htmlNode, (newHtmlNode) => {
      const element = document.createElement('div')
      element.innerHTML = newHtmlNode
      return [...element.childNodes].filter(child => child instanceof HTMLElement) as HTMLElement[]
    }, {
      immediate: true
    })
  }
  return htmlNode
}


