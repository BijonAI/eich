import { TextMode, type ChildNode, type DocumentNode, type ElementNode, NodeType, parse as parseSource, FragmentNode } from './parser'

export type EachSourceNode =
  | EachIfNode
  | EachTextNode
  | EachBasicNode

export const kTextNode = Symbol('Eich/Text')

export interface EachTextNode {
  tag: typeof kTextNode
  value: string
  raw: ChildNode
}

export interface EachIfNode {
  tag: 'if'
  attrs: Record<string, any>
  children: EachSourceNode[]
  else?: EachElseNode
  elif?: EachElifNode[]
  raw: ChildNode
}

export interface EachElifNode {
  tag: 'elif'
  attrs: Record<string, any>
  children: EachSourceNode[]
  raw: ChildNode
}

export interface EachElseNode {
  tag: 'else'
  attrs: Record<string, any>
  children: EachSourceNode[]
  raw: ChildNode
}

export interface EachBasicNode {
  tag: string
  attrs: Record<string, any>
  children: EachSourceNode[]
  raw: ChildNode
}

export type EachContext = Record<string, any>

function toNode(root: ElementNode | FragmentNode): EachSourceNode {
  const node: EachSourceNode = {
    tag: root.type == NodeType.ELEMENT ? root.tag : 'fragment',
    attrs: root.type == NodeType.ELEMENT ? root.attributes.reduce((prev, v) => {
      prev[v.name] = v.value == '' ? true : v.value
      return prev
    }, {} as Record<string, any>) : {},
    raw: root,
    children: [],
  }

  let index = 0
  while (index < root.children.length) {
    const child = root.children[index]
    if (child.type == NodeType.TEXT) {
      const text = child.content.trim()
      if (text.length != 0) {
        node.children.push({
          tag: kTextNode,
          value: child.content,
          raw: child,
        } satisfies EachTextNode)
      }
      index += 1
      continue
    }

    if (child.type == NodeType.VALUE) {
      node.children.push({
        tag: 'value',
        attrs: {
          '$data': child.value.trim()
        },
        children: [],
        raw: child
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
        const ifNode = toNode(child) as EachIfNode

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
              ifNode.elif.push(toNode(child) as EachElifNode)
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
            ifNode.else = toNode(child) as EachElseNode
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

function toRoots(doc: DocumentNode): EachSourceNode[] {
  const children: EachSourceNode[] = []
  for (const child of doc.children) {
    if (child.type == NodeType.TEXT) {
      const text = child.content.trim()
      if (text.length == 0) {
        continue
      }
      children.push({
        tag: kTextNode,
        value: child.content,
        raw: child,
      } satisfies EachTextNode)
    }
    else if (child.type == NodeType.VALUE) {
      children.push({
        tag: 'value',
        attrs: {
          '$data': child.value.trim()
        },
        children: [],
        raw: child
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

export function parse(input: string): EachSourceNode[] {
  return toRoots(parseSource(input, { resolver: modeResolver }))
}

export function isEachTextNode(node: EachSourceNode): node is EachTextNode {
  return node.tag == kTextNode
}

export function isEachIfNode(node: EachSourceNode): node is EachIfNode {
  return node.tag == 'if'
}

export const textMode = new Map<string, TextMode>()
function modeResolver(tag: string) {
  return textMode.get(tag) ?? TextMode.DATA
}