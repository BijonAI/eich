import type { Context } from './renderer'
import { effect, type MaybeRefOrGetter, shallowReactive, stop, toRefs, toValue, unref } from '@vue/reactivity'
import { toDisplayString } from '@vue/shared'
import { parse } from './parser'
import { createAdhoc, getCurrentContext, hasContext, renderRoots } from './renderer'

export function style(source: TemplateStringsArray, ...values: MaybeRefOrGetter<unknown>[]): () => void {
  const style = document.createElement('style')
  const e = effect(() => {
    style.textContent = source.reduce((acc, v, i) => `${acc}${v}${toDisplayString(toValue(values[i]))}`, '')
  })

  document.head.appendChild(style)

  return () => {
    stop(e)
    style.remove()
  }
}

export function eich(literal: TemplateStringsArray, ...values: MaybeRefOrGetter<unknown>[]): Node[] {
  const uid = Math.round(performance.now() * 100)
  const src = literal.reduce((acc, v, i) => {
    return `${acc}${v}${i == literal.length - 1 ? '' : `($$_EachEnv_${uid}_${i}_)`}`
  }, '').trim()
  const ast = parse(src)

  const o = values.reduce<Context>((acc, v, i) => {
    acc[`$$_EachEnv_${uid}_${i}_`] = v
    return acc
  }, {})

  return renderRoots(ast, undefined, hasContext() ? shallowReactive(Object.assign(o, toRefs(getCurrentContext()))) : o)[0]
}

export function createDelegate(map: Record<string, any>, eventNames?: string[], adhoc: boolean = true): (node: Node) => void {
  if (eventNames == null) {
    eventNames = Object.keys(map).filter(v => v.startsWith('@') && v.length > 1)
  }

  const delegates: [string, EventListener][] = []

  for (const key of eventNames) {
    const event = key.slice(1).toLowerCase()
    const handler = unref(map[key])
    if (typeof handler == 'string' && adhoc) {
      delegates.push([event, createAdhoc(`(function($event){${handler}})`, getCurrentContext())() as any])
    }
    else if (typeof handler == 'function') {
      delegates.push([event, handler])
    }
  }

  return node => delegates.forEach(([event, handler]) => node.addEventListener(event, handler))
}
