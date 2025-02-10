import type { ChildNode, DocumentNode, ElementNode, FragmentNode } from './parser'
import { parse, type PseudoSelector, type Selector } from 'css-what'
import { NodeType, queryNode } from './parser'

type ValidNode = ElementNode | FragmentNode | DocumentNode

const NTH_REGEX = /^([+-]?\d*)n(?:\s*([+-]\s*\d+))?$/
const WHITESPACE_REGEX = /\s+/
const SELECTOR_CACHE = new Map<string, Selector[][]>()
const NTH_EXPR_CACHE = new Map<string, { a: number, b: number }>()

const NTH_CACHE: Record<string, { a: number, b: number }> = {
  odd: { a: 2, b: 1 },
  even: { a: 2, b: 0 },
}

const SIBLINGS_CACHE = new WeakMap<ValidNode, ElementNode[]>()

function isValidNode(node: ChildNode): node is ValidNode {
  return node.type === NodeType.ELEMENT || node.type === NodeType.DOCUMENT || node.type === NodeType.FRAGMENT
}

function getElementSiblings(node: ValidNode): ElementNode[] {
  let siblings = SIBLINGS_CACHE.get(node)
  if (siblings)
    return siblings

  if (!node.parent || !isValidNode(node.parent))
    return []

  siblings = node.parent.children.filter((child): child is ElementNode => child.type === NodeType.ELEMENT)
  SIBLINGS_CACHE.set(node, siblings)
  return siblings
}

const ELEMENT_INDEX_CACHE = new WeakMap<ValidNode, number>()

function getElementIndex(element: ValidNode, siblings: ElementNode[]): number {
  let index = ELEMENT_INDEX_CACHE.get(element)
  if (index !== undefined)
    return index

  index = siblings.findIndex(sibling => sibling === element)
  ELEMENT_INDEX_CACHE.set(element, index)
  return index
}

function parseNthExpression(expr: string): { a: number, b: number } {
  if (NTH_CACHE[expr])
    return NTH_CACHE[expr]
  if (NTH_EXPR_CACHE.has(expr))
    return NTH_EXPR_CACHE.get(expr)!

  const match = expr.match(NTH_REGEX)
  let result: { a: number, b: number }

  if (match) {
    const a = match[1] === '-' ? -1 : match[1] === '+' || !match[1] ? 1 : Number.parseInt(match[1], 10)
    const b = match[2] ? Number.parseInt(match[2].replace(/\s/g, ''), 10) : 0
    result = { a, b }
  }
  else {
    result = { a: 0, b: Number.parseInt(expr, 10) }
  }

  NTH_EXPR_CACHE.set(expr, result)
  return result
}

function matchesNthChild(element: ValidNode, expr: string, fromEnd: boolean = false): boolean {
  const siblings = getElementSiblings(element)
  const index = fromEnd
    ? siblings.length - getElementIndex(element, siblings)
    : getElementIndex(element, siblings) + 1

  const { a, b } = parseNthExpression(expr)
  if (a === 0)
    return index === b
  const n = index - b
  return n % a === 0 && n / a >= 0
}

const PSEUDO_HANDLERS: Record<string, (element: ValidNode, siblings: ElementNode[]) => boolean> = {
  'first-child': (element, siblings) => getElementIndex(element, siblings) === 0,
  'last-child': (element, siblings) => getElementIndex(element, siblings) === siblings.length - 1,
  'only-child': (_, siblings) => siblings.length === 1,
  'empty': element => element.children.length === 0,
  'root': element => element.type === NodeType.DOCUMENT,
}

function matchesPseudo(node: ChildNode, selector: PseudoSelector): boolean {
  if (!isValidNode(node))
    return false
  if (selector.data != null && typeof selector.data !== 'string')
    return false

  const element = node
  const siblings = getElementSiblings(element)

  const basicHandler = PSEUDO_HANDLERS[selector.name]
  if (basicHandler)
    return basicHandler(element, siblings)

  switch (selector.name) {
    case 'nth-child':
      return selector.data ? matchesNthChild(element, selector.data) : false
    case 'nth-last-child':
      return selector.data ? matchesNthChild(element, selector.data, true) : false
    default:
      if (element.type === NodeType.ELEMENT) {
        const sameType = siblings.filter(sibling => sibling.tag === element.tag)
        switch (selector.name) {
          case 'first-of-type':
            return getElementIndex(element, sameType) === 0
          case 'last-of-type':
            return getElementIndex(element, sameType) === sameType.length - 1
          case 'only-of-type':
            return sameType.length === 1
          case 'nth-of-type':
            return selector.data ? matchesNthChild(element, selector.data) : false
          case 'nth-last-of-type':
            return selector.data ? matchesNthChild(element, selector.data, true) : false
        }
      }
      return false
  }
}

const ATTR_MATCHERS: Record<string, (elementValue: string, attrValue: string) => boolean> = {
  equals: (elementValue, attrValue) => elementValue === attrValue,
  exists: () => true,
  start: (elementValue, attrValue) => elementValue.startsWith(attrValue),
  end: (elementValue, attrValue) => elementValue.endsWith(attrValue),
  element: (elementValue, attrValue) => elementValue.split(WHITESPACE_REGEX).includes(attrValue),
  any: (elementValue, attrValue) => elementValue.includes(attrValue),
  hyphen: (elementValue, attrValue) => elementValue === attrValue || elementValue.startsWith(`${attrValue}-`),
}

function matchesSelector(node: ChildNode, selector: Selector): boolean {
  if (!isValidNode(node) && selector.type !== 'universal')
    return false
  const element = node as ElementNode

  if (node.type === NodeType.FRAGMENT)
    return true

  switch (selector.type) {
    case 'tag':
      if (element.tag == null) {
        return false
      }
      return element.tag.toLowerCase() === selector.name.toLowerCase()
    case 'attribute': {
      if (element.attributes == null) {
        return false
      }
      const elementAttr = element.attributes.find(a => a.name.toLowerCase() === selector.name.toLowerCase())
      if (!elementAttr || !selector.value)
        return !!elementAttr

      const matcher = ATTR_MATCHERS[selector.action]
      return matcher ? matcher(elementAttr.value, selector.value) : false
    }
    case 'universal':
      return true
    case 'pseudo':
      return matchesPseudo(node, selector)
    default:
      return false
  }
}

function getParentNode(node: ChildNode): ChildNode | undefined {
  let parent = node.parent
  while (parent && parent.type === NodeType.FRAGMENT) {
    parent = parent.parent
  }
  return parent
}

function matchesCompound(child: ChildNode, selectors: Selector[]): boolean {
  let index = 0
  const len = selectors.length

  while (index < len) {
    if (index < len - 2 && isValidNode(child)) {
      const currentSelector = selectors[index]
      const nextSelector = selectors[index + 1]
      const node = child

      switch (nextSelector.type) {
        case 'descendant': {
          let ancestor: ChildNode | undefined = getParentNode(node)
          let valid = false
          while (ancestor) {
            if (matchesSelector(ancestor, currentSelector)) {
              valid = true
              break
            }
            ancestor = getParentNode(ancestor)
          }
          if (!valid)
            return false
          index += 2
          break
        }
        case 'child': {
          const parent = getParentNode(node)
          if (!parent || !matchesSelector(parent, currentSelector)) {
            return false
          }
          index += 2
          break
        }
        case 'adjacent': {
          const parent = getParentNode(node)
          if (!parent)
            return false
          const siblings = getElementSiblings(parent as ValidNode)
          const idx = getElementIndex(node as ValidNode, siblings)
          if (idx <= 0 || !matchesSelector(siblings[idx - 1], currentSelector)) {
            return false
          }
          index += 2
          break
        }
        case 'sibling': {
          const parent = getParentNode(node)
          if (!parent)
            return false
          const siblings = getElementSiblings(parent as ValidNode)
          const idx = getElementIndex(node as ValidNode, siblings)
          if (idx > 0) {
            const prevSiblings = siblings.slice(0, idx)
            if (!prevSiblings.some(sibling => matchesSelector(sibling, currentSelector))) {
              return false
            }
          }
          else {
            return false
          }
          index += 2
          break
        }
        default: {
          if (!matchesSelector(node, currentSelector))
            return false
          index++
        }
      }
    }
    else {
      if (!matchesSelector(child, selectors[index]))
        return false
      index++
    }
  }
  return true
}

function matchesAny(node: ChildNode, selectorsList: Selector[][]): boolean {
  return selectorsList.some(selectors => matchesCompound(node, selectors))
}

export function querySelector(root: ChildNode | ChildNode[], selector: string): ChildNode | null {
  let parsed = SELECTOR_CACHE.get(selector)
  if (!parsed) {
    parsed = parse(selector)
    SELECTOR_CACHE.set(selector, parsed)
  }

  const results = queryNode(
    node => matchesAny(node, parsed),
    root,
    1,
  )
  return results.size > 0 ? Array.from(results)[0] : null
}

export function querySelectorAll(root: ChildNode | ChildNode[], selector: string): Set<ChildNode> {
  let parsed = SELECTOR_CACHE.get(selector)
  if (!parsed) {
    parsed = parse(selector)
    SELECTOR_CACHE.set(selector, parsed)
  }

  return new Set(queryNode(
    node => matchesAny(node, parsed),
    root,
    false,
  ))
}
