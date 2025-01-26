import type { ParseOptions } from 'node:querystring'
import { type ChildNode, type DocumentNode, type ElementNode, type FragmentNode, NodeType, parse as parseRaw, TextMode } from './parser'

export type EichSourceNode =
  | EichIfNode
  | EichTextNode
  | EichBasicNode

export const kTextNode = Symbol('Eich/Text')

export interface EichTextNode {
  tag: typeof kTextNode
  value: string
  raw: ChildNode
}

export interface EichIfNode {
  tag: 'if'
  attrs: Record<string, any>
  children: EichSourceNode[]
  else?: EichElseNode
  elif?: EichElifNode[]
  raw: ChildNode
}

export interface EichElifNode {
  tag: 'elif'
  attrs: Record<string, any>
  children: EichSourceNode[]
  raw: ChildNode
}

export interface EichElseNode {
  tag: 'else'
  attrs: Record<string, any>
  children: EichSourceNode[]
  raw: ChildNode
}

export interface EichBasicNode {
  tag: string
  attrs: Record<string, any>
  children: EichSourceNode[]
  raw: ChildNode
}

export type EichContext = Record<string, any>

function toNode(root: ElementNode | FragmentNode): EichSourceNode {
  const node: EichSourceNode = {
    tag: root.type == NodeType.ELEMENT ? root.tag : 'fragment',
    attrs: root.type == NodeType.ELEMENT
      ? root.attributes.reduce((prev, v) => {
          prev[v.name] = v.value == '' ? true : v.value
          return prev
        }, {} as Record<string, any>)
      : {},
    raw: root,
    children: [],
  }

  let index = 0
  while (index < root.children.length) {
    const child = root.children[index]
    if (child.type == NodeType.TEXT) {
      node.children.push({
        tag: kTextNode,
        value: child.content,
        raw: child,
      } satisfies EichTextNode)
      index += 1
      continue
    }

    if (child.type == NodeType.VALUE) {
      node.children.push({
        tag: 'value',
        attrs: {
          $data: child.value.trim(),
        },
        children: [],
        raw: child,
      })
      index += 1
      continue
    }

    if (child.type == NodeType.FRAGMENT) {
      node.children.push(toNode(child))
      index += 1
      continue
    }

    if (child.type == NodeType.ELEMENT) {
      if (child.tag == 'elif' || child.tag == 'else') {
        throw new TypeError(`unexpected tag <${child.tag}>`)
      }

      if (child.tag == 'if') {
        const ifNode = toNode(child) as EichIfNode

        index += 1
        while (index < root.children.length) {
          const child = root.children[index]
          if (child.type == NodeType.TEXT) {
            const text = child.content.trim()
            if (text.length == 0) {
              index += 1
              continue
            }
            break
          }

          if (child.type == NodeType.ELEMENT) {
            if (child.tag == 'elif') {
              ifNode.elif ??= []
              ifNode.elif.push(toNode(child) as EichElifNode)
              index += 1
              continue
            }
          }
          break
        }

        while (index < root.children.length) {
          const child = root.children[index]

          if (child.type == NodeType.TEXT) {
            const text = child.content.trim()
            if (text.length == 0) {
              index += 1
              continue
            }
          }

          break
        }

        if (index < root.children.length) {
          const child = root.children[index]
          if (child.type == NodeType.ELEMENT && child.tag == 'else') {
            ifNode.else = toNode(child) as EichElseNode
            index += 1
          }
        }

        node.children.push(ifNode)
        continue
      }

      node.children.push(toNode(child))
      index += 1
      continue
    }
  }

  return node
}

function toRoots(doc: DocumentNode): EichSourceNode[] {
  const children: EichSourceNode[] = []
  for (const child of doc.children) {
    if (child.type == NodeType.TEXT) {
      children.push({
        tag: kTextNode,
        value: child.content,
        raw: child,
      } satisfies EichTextNode)
    }
    else if (child.type == NodeType.VALUE) {
      children.push({
        tag: 'value',
        attrs: {
          $data: child.value.trim(),
        },
        children: [],
        raw: child,
      })
    }
    else if (child.type == NodeType.ELEMENT || child.type == NodeType.FRAGMENT) {
      const ast = toNode(child)
      if (typeof ast != 'string') {
        children.push(ast)
      }
    }
  }

  return children
}

export { toRoots as parseFromRaw }

export function parseSource(input: string, options: Omit<ParseOptions, 'resolver'> = {}): DocumentNode {
  return parseRaw(input, { resolver: modeResolver, ...options })
}

export function parse(input: string): EichSourceNode[] {
  return toRoots(parseSource(input))
}

export function isEichTextNode(node: EichSourceNode): node is EichTextNode {
  return node.tag == kTextNode
}

export function isEichIfNode(node: EichSourceNode): node is EichIfNode {
  return node.tag == 'if'
}

export const textMode = new Map<string, TextMode>()
function modeResolver(tag: string) {
  return textMode.get(tag) ?? TextMode.DATA
}
