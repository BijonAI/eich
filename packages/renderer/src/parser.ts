import { runInContext } from "./context";
import { EichBasicNode, EichTextNode } from "./node";
import { CommonRecord } from "./utils";
import { getActiveContext } from "./context";
import { Parser } from "htmlparser2";

export function processAttrs(attrs: CommonRecord<string>) {
  return Object.fromEntries(
    Object.keys(attrs).map(
      key => {
        if (key.startsWith('$')) return [key, runInContext(attrs[key], getActiveContext())]
        if (key.startsWith('@')) return [key, attrs[key]]
        return [key, attrs[key]]
      }
    )
  )
}

export function prefix(eichString: string) {
  const nodes: EichBasicNode[] = []
  const stack: EichBasicNode[] = []
  let currentNode: EichBasicNode | null = null
  
  const parser = new Parser({
    onopentag(tag, attrs) {
      const processedAttrs = processAttrs(attrs)
      currentNode = {
        tag,
        props: processedAttrs,
        value: '',
        children: []
      }
      if (stack.length > 0) {
        stack[stack.length - 1].children.push(currentNode)
      } else {
        nodes.push(currentNode)
      }
      stack.push(currentNode)
    },
    ontext(text) {
      if (text.trim()) {
        const textNode: EichBasicNode = {
          tag: '#text',
          props: {},
          value: text,
          children: []
        }
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(textNode)
        } else {
          nodes.push(textNode)
        }
      }
    },
    onclosetag() {
      stack.pop()
      currentNode = stack[stack.length - 1] || null
    }
  })
  parser.write(eichString)
  parser.end()
  
  return nodes
}

export function toRoot(eichString: string): EichBasicNode<string, CommonRecord<any>> {
  const nodes = prefix(eichString)
  return Array.isArray(nodes) && nodes.length === 1 ? nodes[0] : {
    tag: '#root',
    props: {},
    value: '',
    children: nodes
  }
}
