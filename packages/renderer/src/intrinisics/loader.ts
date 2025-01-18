import { Attributes, Component, intrinsics } from "../renderer"

export type RegistryEntry = [string, Registry | Component]

export class Registry {
  namespaces: Map<string, Registry> = new Map()
  children: Map<string, Component<any>> = new Map()
  
  register(...inputs: (RegistryEntry | RegistryEntry[])[]): void
  register(name: string, input: Registry | Component<any>): void
  register(arg_0: any, arg_1: any): void {
    if (Array.isArray(arg_0)) {
      arg_0.forEach(v => this.register(...v))
      return
    }

    if (typeof arg_0 == 'string' && arg_1 != null) {
      arg_1 instanceof Registry 
        ? this.namespaces.set(arg_0, arg_1)
        : this.children.set(arg_0, arg_1)
    }
  }

  resolve<T extends Attributes = any>(tagName: string, withIntrinsics: boolean = true): Component<T> | undefined {
    tagName = tagName.trim()

    if (withIntrinsics && intrinsics.has(tagName)) {
      return intrinsics.get(tagName)
    }

    const path = tagName.split('.')
    let next: Registry = this
    let idx = 0
    while (next instanceof Registry && idx < path.length) {
      const p = path[idx].trim()
      if (p == '' || p != path[idx]) {
        throw new Error('invalid tag path: ' + tagName)
      }

      if (next.children.has(path[idx]) && idx == path.length - 1) {
        return next.children.get(path[idx])
      }

      if (next.namespaces.has(path[idx])) {
        next = next.namespaces.get(path[idx])!
        idx += 1
        continue
      }

      return undefined
    }
  }
}

export interface Loader {
  resolve?(url: string): URL
  load(url: URL): Promise<string>
  execute?(source: string): Promise<Component<any> | Registry>
}