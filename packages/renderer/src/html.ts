import { effect, isRef, type MaybeRefOrGetter, toValue } from '@vue/reactivity'
import { toDisplayString } from '@vue/shared'
import clsx, { type ClassValue } from 'clsx'

function _transformTmpl(literal: readonly string[], keys?: (string | number)[]): any {
  if (keys && keys.length < literal.length - 1) {
    throw new TypeError('Invalid keys length')
  }

  return literal.reduce((acc, v, i) => {
    const propStartMatch = v.match(/^(.*)\s([@\w.:-]+)=\s*$/ms)
    if (propStartMatch != null) {
      return `${acc}${propStartMatch[1]} rx-attrs rx-attr-${propStartMatch[2]}="${keys ? keys[i] : i}" `
    }
    return `${acc}${v}${i == literal.length - 1 ? '' : `<slot rx-slot="${keys ? keys[i] : i}" />`}`
  }, '').trim()
}

function _parseTmpl(html: string): Node {
  const el = document.createElement('div')
  el.innerHTML = html
  if (el.children.length != 1) {
    throw new TypeError(`Invalid template \n---\n${html}\n---\n`)
  }

  return el
}

function isDOMNode(x: any): x is Node {
  return Number.isInteger(x.nodeType)
}

function _createTextNode(val: MaybeRefOrGetter<unknown>): Text {
  const text = document.createTextNode('')
  effect(() => {
    text.textContent = toDisplayString(toValue(val))
  })
  return text
}

function _renderTmpl(root: Node, values: Record<string | number, InterpolateParam> | InterpolateParam[], rawAttrs = false): Node {
  if (root.nodeType == 3) {
    return root
  }

  if (root.nodeType != 1) {
    throw new TypeError('Invalid node type')
  }

  const el = root as Element
  const isArray = Array.isArray(values)

  el.querySelectorAll('[rx-slot]').forEach((slot) => {
    const key = slot.getAttribute('rx-slot') as any

    const index = isArray ? Number.parseInt(key) : key
    if (isDOMNode(values[index])) {
      slot.replaceWith(values[index])
    }
    else if (Array.isArray(values[index])) {
      slot.replaceWith(...values[index].map(v => isDOMNode(v) ? v : _createTextNode(v)))
    }
    else if (values[index] != null) {
      slot.replaceWith(_createTextNode(values[index]))
    }

    slot.remove()
  })

  el.querySelectorAll('[rx-attrs]').forEach((el) => {
    el.removeAttribute('rx-attrs')
    for (const attr of el.getAttributeNames()) {
      if (attr.startsWith('rx-attr-')) {
        const name = attr.slice(8)
        const index = isArray ? Number.parseInt(el.getAttribute(attr)!) : el.getAttribute(attr)! as any
        el.removeAttribute(attr)
        if (values[index] != null) {
          rawAttrs
            ? effect(() => {
                el.setAttribute(name, toDisplayString(toValue((values as any)[index])))
              })
            : _setRxAttr(el, name, values[index])
        }
      }
    }
  })

  return el.firstChild!
}

function _setRxAttr(el: Element, name: string, value: unknown): void {
  if (name.startsWith('@') && typeof value == 'function') {
    const eventName = name.slice(1)
    el.addEventListener(eventName, value as any)
    return
  }

  if (name[0] != ':') {
    return
  }

  const attr = name.slice(1)

  if (attr == 'class') {
    effect(() => {
      el.className = clsx(toValue((value as any)))
    })
  }
  else if (attr == 'style') {
    effect(() => {
      const style = toValue(value) as any
      typeof style == 'object'
        ? el.setAttribute(name, Object.assign((el as HTMLElement).style, style))
        : el.setAttribute('style', toDisplayString(style))
    })
  }
  else if (attr == 'ref') {
    if (isRef(value)) {
      value.value = el
    }
  }
  else {
    effect(() => {
      const val = toValue(value)
      typeof val == 'boolean'
        ? (val ? el.setAttribute(name, '') : el.removeAttribute(name))
        : el.setAttribute(name, toDisplayString(val))
    })
  }
}

export type InterpolateParam =
  | MaybeRefOrGetter<ClassValue>
  | Node
  | (MaybeRefOrGetter<ClassValue> | Node)[]
  | EventListenerOrEventListenerObject

export type Template<T extends (string | number)> =
  (values: Record<T, InterpolateParam>, rawAttrs?: boolean) => Node

export function template<const T extends (string | number)>(
  literal: TemplateStringsArray,
  ...keys: T[]
): Template<T> {
  const proto = _parseTmpl(_transformTmpl(literal, keys))
  return (values: Record<T, InterpolateParam>, rawAttrs?: boolean) =>
    _renderTmpl(proto.cloneNode(true), values, rawAttrs)
}

export function html(
  literal: TemplateStringsArray,
  ...values: InterpolateParam[]
): Node {
  return _renderTmpl(_parseTmpl(_transformTmpl(literal)), values)
}
