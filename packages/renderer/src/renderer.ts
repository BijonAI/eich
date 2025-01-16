import { computed, ComputedRef, effect, watch } from "@vue/reactivity";
import { Context, getActiveContext, runInContext } from "./context";
import { EichBasicNode } from "./node";
import { CommonRecord, convertToCamelCase, MaybeNull } from "./utils";
import patch from 'morphdom'

export function processAttrs(attrs: CommonRecord<string>) {
  return Object.fromEntries(
    Object.keys(attrs).map(key => {
      if (key.startsWith('$')) return [convertToCamelCase(key.slice(1)), runInContext(attrs[key], getActiveContext())]
      if (key.startsWith('@')) return [convertToCamelCase(key), runInContext(`function() { ${attrs[key]} }`, getActiveContext())]
      return [convertToCamelCase(key), attrs[key]]
    })
  )
}

export const RegistryComponent = {
  intrinsics: new Map<string, Component<any>>(),
  styles: new Set<string>(),
  register(name: string, component: Component<any>) {
    this.intrinsics.set(name, component)
  },
  get(name: string) {
    return this.intrinsics.get(name)
  },
  has(name: string) {
    return this.intrinsics.has(name)
  },
  style(style: string) {
    this.styles.add(style)
  },
}

export type Component<T extends EichBasicNode> = (props: T['props'], slots: (beforeRender?: (index: number) => void) => ComputedRef<HTMLElement[]>[]) => (context: Context) => MaybeNull<ComputedRef<HTMLElement[]>>

export function defineComponent<T extends EichBasicNode>(component: Component<T>) {
  return component
}

export function renderToElement(node: EichBasicNode): ComputedRef<HTMLElement[]> {
  if (RegistryComponent.has(node.tag)) {
    const component = RegistryComponent.get(node.tag)
    if (!component) {
      console.warn(`Component ${node.tag} not found`)
    }
    const processedAttrs = processAttrs(node.props)
    const slots = (beforeRender?: (index: number) => void) => node.children.map((child, index) => {
      if (beforeRender) beforeRender(index)
      
      const rendered = renderToElement(child)
      
      return rendered
    })
    const maybeNode = component && component(processedAttrs, slots)(getActiveContext())
    effect(() => {
      Object.keys(processedAttrs).forEach(key => {
        if (key.startsWith('@')) {
          const event = processedAttrs[key]
          maybeNode?.value.forEach(node => node.addEventListener(key.slice(1), event))
        }
      })
    })
    if (maybeNode && maybeNode !== null) return maybeNode
    else return computed(() => [])
  }
  return computed(() => [])
}

export function render(node: EichBasicNode) {
  return renderToElement(node)
}
