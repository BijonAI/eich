import { computed, type ComputedRef } from '@vue/reactivity'
import { type Attributes, type Context, getCurrentContext } from './renderer'

export type Adhoc<T> = (context?: Context) => T
export type MapToAdhoc<T> = { [P in keyof T]: Adhoc<T[P]> }

export function createAdhoc<T = unknown>(src: string, context?: Context): Adhoc<T>
export function createAdhoc<const T extends [unknown] | unknown[]>(src: string[], context?: Context): MapToAdhoc<T>
export function createAdhoc<const T extends Record<string | number, unknown>>(src: Record<keyof T, string>, context?: Context): MapToAdhoc<T>
export function createAdhoc(src: unknown, context?: Context): unknown {
  if (typeof src == 'string') {
    return _createAdhoc(src, context)
  }
  else if (Array.isArray(src)) {
    return src.map((v) => {
      if (typeof v != 'string') {
        throw new TypeError('invalid adhoc source')
      }
      return _createAdhoc(v, context)
    })
  }
  else if (typeof src == 'object' && src != null) {
    const o: any = {}
    for (const key in src) {
      if (typeof (src as any)[key] != 'string') {
        throw new TypeError('invalid adhoc source')
      }
      o[key] = _createAdhoc((src as any)[key], context)
    }
    return o
  }
}

export type TypeConstructors = 
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor
  | ObjectConstructor
  | ArrayConstructor

export type TypedAttrsRef<T extends Record<string, TypeConstructors>> = {
  [P in keyof T]?: ReturnType<T[P]>
}

export function useTypedAttrs<const T extends Record<string, TypeConstructors>>(attrs: any, keys: T, context: Context = getCurrentContext()): TypedAttrsRef<T> {
  const o: any = {}
  for (const k in attrs) {
    if (typeof attrs[`$${k}`] == 'string') {
      const adhoc = _createAdhoc(attrs[`$${k}`], context)
      o[k] = computed(() => {
        const value = adhoc()
        if (keys[k] == Array) {
          return Array.isArray(value) ? value : []
        } else if (keys[k] != Object) {
          return (keys[k] as any)(value)
        } else {
          return value
        }
      })
    }
    else if (attrs[k] != null) {
      if (keys[k] == Array) {
        o[k] = Array.isArray(attrs[k]) ? attrs[k] : []
      } else if (keys[k] != Object) {
        o[k] = (keys[k] as any)(attrs[k])
      } else {
        o[k] = attrs[k]
      }
    }
  }
  return o
}

export function useAttrs<const K extends string>(attrs: Attributes, keys: K[], context: Context = getCurrentContext()): { [P in K]?: ComputedRef<string> | string } {
  const o: any = {}
  for (const k of keys) {
    if (typeof attrs[`$${k}`] == 'string') {
      const adhoc = _createAdhoc(attrs[`$${k}`], context)
      o[k] = computed(() => adhoc())
    }
    else if (attrs[k] != null) {
      o[k] = attrs[k]
    }
  }
  return o
}

export function useAttrValues<const T extends [unknown] | unknown = string[]>(attrs: Attributes, keys: string[], context: Context = getCurrentContext()): { [P in keyof T]?: ComputedRef<T[P]> | T[P] } {
  return keys.map((k) => {
    if (typeof attrs[`$${k}`] == 'string') {
      const adhoc = _createAdhoc(attrs[`$${k}`], context)
      return computed(() => adhoc())
    }
    else if (attrs[k] != null) {
      return attrs[k]
    }
    return undefined
  }) as any
}

export function useAttr<const T = string>(attrs: Attributes, key: string, context: Context = getCurrentContext()): ComputedRef<T> | T | undefined {
  if (typeof attrs[`$${key}`] == 'string') {
    const adhoc = _createAdhoc(attrs[`$${key}`], context)
    return computed(() => adhoc() as T)
  }
  else if (attrs[key] != null) {
    return attrs[key]
  }
  return undefined
}

function _createAdhoc<T = unknown>(src: string, context?: Context): (context?: Context) => T {
  // eslint-disable-next-line no-new-func
  const adhoc = new Function(`return (function($__eich_ctx){with($__eich_ctx){return (${src});}});`)() as any
  return (ctx) => {
    if (ctx == null && context == null) {
      throw new TypeError('missing context')
    }

    return adhoc(ctx ?? context!)
  }
}
