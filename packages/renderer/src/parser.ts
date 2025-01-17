import {
  type DocumentNode,
  NodeTypes,
  parse as parseHTML,
  type TagNode,
  type TextNode,
} from 'es-html-parser'

export type EachSourceNode =
  | EachIfNode
  | EachTextNode
  | EachBasicNode

export interface EachTextNode {
  tag: '#text'
  value: string
}

export interface EachIfNode {
  tag: 'if'
  attrs: Record<string, any>
  children: EachSourceNode[]
  else?: EachElseNode
  elif?: EachElifNode[]
}

export interface EachElifNode {
  tag: 'elif'
  attrs: Record<string, any>
  children: EachSourceNode[]
}

export interface EachElseNode {
  tag: 'else'
  attrs: Record<string, any>
  children: EachSourceNode[]
}

export interface EachBasicNode {
  tag: string
  attrs: Record<string, any>
  children: EachSourceNode[]
}

export type EachContext = Record<string, any>

function isTagNode(node: any): node is TagNode {
  return node.type == NodeTypes.Tag
}

function isTextNode(node: any): node is TextNode {
  return node.type == NodeTypes.Text
}

function toNode(root: TagNode): EachSourceNode {
  const node: EachSourceNode = {
    tag: root.name,
    attrs: root.attributes.reduce((prev, v) => {
      prev[v.key.value] = v.value?.value ?? true
      return prev
    }, {} as Record<string, any>),
    children: [],
  }

  let index = 0
  while (index < root.children.length) {
    const child = root.children[index]
    if (isTextNode(child)) {
      const text = child.value.trim()
      if (text.length != 0) {
        node.children.push({
          tag: '#text',
          value: child.value,
        } satisfies EachTextNode)
      }
      index += 1
      continue
    }

    if (isTagNode(child)) {
      if (child.name == 'elif' || child.name == 'else') {
        throw new TypeError(`unexpected tag <${child.name}>`)
      }

      if (child.name == 'if') {
        const ifNode = toNode(child) as EachIfNode

        index += 1
        while (index < root.children.length) {
          const child = root.children[index]
          if (isTextNode(child)) {
            const text = child.value.trim()
            if (text.length == 0) {
              index += 1
              continue
            }
            break
          }

          if (isTagNode(child)) {
            if (child.name == 'elif') {
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

          if (isTextNode(child)) {
            const text = child.value.trim()
            if (text.length == 0) {
              index += 1
              continue
            }
          }

          break
        }

        if (index < root.children.length) {
          const child = root.children[index]
          if (isTagNode(child) && child.name == 'else') {
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
    if (child.type == NodeTypes.Text) {
      const text = child.value.trim()
      if (text.length == 0) {
        continue
      }
      children.push({
        tag: '#text',
        value: child.value,
      } satisfies EachTextNode)
    }

    if (child.type == NodeTypes.Tag) {
      const ast = toNode(child)
      if (typeof ast != 'string') {
        children.push(ast)
      }
    }
  }

  return children
}

export function parse(input: string): EachSourceNode[] {
  return toRoots(parseHTML(input).ast)
}

export function isEachTextNode(node: EachSourceNode): node is EachTextNode {
  return node.tag == '#text'
}

export function isEachIfNode(node: EachSourceNode): node is EachIfNode {
  return node.tag == 'if'
}
