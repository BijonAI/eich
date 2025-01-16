import { isRef, WatchSource } from "@vue/reactivity";
import { CommonRecord } from "./utils";

export const replacerSymbol = Symbol('replacer')
export type Replacer = [typeof replacerSymbol, string]
export type Serializable = string | number | boolean | null | undefined
export type AttributeValue = Serializable | Replacer | WatchSource
export type Context = CommonRecord<AttributeValue>
let activeContext: Context = {}

declare global {
  interface Window {
    resolve: (name: string) => AttributeValue
  }
}

export function createReplacer(expr: string) {
  return [replacerSymbol, expr]
}

export function isReplacer(value: any): value is Replacer {
  return Array.isArray(value) && value[0] === replacerSymbol
}

export function serialize(value: AttributeValue) {
  if (isReplacer(value)) return value[1]
  if (isRef(value)) return value.value
  return value
}

export function run(expr: string, context: Context) {
  window.resolve = function (name: string) {
    if (context[name]) return context[name]
    console.warn(`Variable ${name} not found`)
    return name
  }
  const result = new Function(`return ((${Object.keys(context).join(', ')}) => (${expr}))(${Object.keys(context).map(key => `window.resolve('${key}')`).join(', ')})`)()
  return result
}

export function runInContext(expr: string, context: Context) {
  const oldContext = activeContext
  
  activeContext = context
  try {
    return run(expr, context)
  } finally {
    activeContext = oldContext
  }
}

export function getActiveContext() {
  if (!activeContext) {
    throw new Error('No active context')
  }
  return activeContext
}

export function setActiveContext(key: string, value: AttributeValue) {
  activeContext[key] = value
}
