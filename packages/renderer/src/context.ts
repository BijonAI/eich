import { CommonRecord } from "./utils";

export const replacerSymbol = Symbol('replacer')
export type Replacer = [typeof replacerSymbol, string]
export type Serializable = string | number | boolean | null | undefined
let activeContext: CommonRecord<Serializable | Replacer> = {}

export function createReplacer(expr: string) {
  return [replacerSymbol, expr]
}

export function isReplacer(value: any): value is Replacer {
  return Array.isArray(value) && value[0] === replacerSymbol
}

export function run(expr: string, context: CommonRecord<Serializable | Replacer>) {
  return new Function(`return ((${Object.keys(context).join(', ')}) => (${expr}))(${Object.values(context).map(value => isReplacer(value) ? value[1] : value).join(', ')})`)()
}

export function runInContext(expr: string, context: CommonRecord<Serializable | Replacer>) {
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
