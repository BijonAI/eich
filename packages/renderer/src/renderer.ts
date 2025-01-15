import { ComputedRef, MaybeRef } from "@vue/reactivity";
import { getActiveContext, Serializable } from "./context";
import { Replacer } from "./context";
import { EichBasicNode } from "./node";
import { CommonRecord } from "./utils";

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

export type Component<T extends EichBasicNode> = (props: T['props']) => (context: CommonRecord<Serializable | Replacer>) => ComputedRef<string>

export function defineComponent<T extends EichBasicNode>(component: Component<T>) {
  return component
}

export function render(node: EichBasicNode) {
  let htmlNode: ComputedRef<string> | undefined
  if (RegistryComponent.has(node.tag)) {
    const component = RegistryComponent.get(node.tag)
    if (!component) {
      console.warn(`Component ${node.tag} not found`)
    }
    htmlNode = component && component(node.props)(getActiveContext())
  }
  if (htmlNode) {
    const element = document.createElement('div')
    element.innerHTML = htmlNode.value
    return [...element.childNodes].filter(child => child instanceof HTMLElement) as HTMLElement[]
  }
  return []
}


