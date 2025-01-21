import { parseEntities } from 'parse-entities'

export enum TextMode {
  DATA,
  RCDATA,
  RAWTEXT,
  CDATA,
}

export enum NodeType {
  TEXT,
  ELEMENT,
  CDATA,
  COMMENT,
  DOCUMENT,
  RAW,
  ATTRIBUTE,
  VALUE,
}

export type ChildNode =
  | ElementNode
  | TextNode
  | CDATANode
  | CommentNode
  | ValueNode
  | DocumentNode

export type Node =
  | ChildNode
  | AttributeNode

export interface ValueNode {
  type: NodeType.VALUE
  value: string
}
export interface DocumentNode {
  type: NodeType.DOCUMENT
  children: ChildNode[]
}

export interface AttributeNode {
  type: NodeType.ATTRIBUTE
  name: string
  value: string
  raw: string
}

export interface ElementNode {
  type: NodeType.ELEMENT
  tag: string
  selfClosing: boolean
  attributes: AttributeNode[]
  children: ChildNode[]
  raw?: string
}

export interface TextNode {
  type: NodeType.TEXT
  raw: string
  content: string
}

export interface CDATANode {
  type: NodeType.CDATA
  content: string
}

export interface CommentNode {
  type: NodeType.COMMENT
  content: string
}

export class ParserContext {
  constructor(
    public source: string,
    public idx: number = 0,
    public mode: TextMode = TextMode.DATA,
    public resolver: ModeResolver = () => TextMode.DATA,
  ) {}

  remaining(end?: number): string {
    return this.source.slice(this.idx, end)
  }

  advance(num: number): void {
    this.idx += num
    if (this.eof) {
      this.idx = this.source.length
    }
  }

  get eof() {
    return this.idx > this.source.length - 1
  }

  startsWith(pat: string): boolean {
    return this.source.startsWith(pat, this.idx)
  }

  indexOf(pat: string, last: boolean = false) {
    return last ? this.source.lastIndexOf(pat, this.idx) : this.source.indexOf(pat, this.idx)
  }

  char(offset: number = 0): string {
    return this.source[this.idx + offset]
  }

  trim(): void {
    const match = /^[\t\r\n\f ]+/.exec(this.source.slice(this.idx))

    if (match) {
      this.idx += match[0].length
    }
  }
}

export type ModeResolver = (tag: string) => TextMode

export function isEnd(context: ParserContext, ancestors: Node[]): boolean {
  if (context.eof) {
    return true
  }

  const parent = ancestors[ancestors.length - 1]
  if (parent && parent.type == NodeType.ELEMENT && context.startsWith(`</${parent.tag}`)) {
    return true
  }

  return false
}

export function parseCDATA(context: ParserContext): CDATANode {
  context.advance(9)
  const endIdx = context.indexOf(']]>')
  if (endIdx == -1) {
    console.error('[eich/parser debug] ', context)
    throw new Error(`[eich/parser] unclosed CDATA tag at input:${context.idx}`)
  }
  const raw = context.remaining(endIdx)
  context.advance(raw.length + 3)
  return {
    type: NodeType.CDATA,
    content: raw,
  }
}

export function parseComment(context: ParserContext): CommentNode {
  let endIdx = context.source.length
  const endTagIdx = context.indexOf('-->')
  if (endIdx != -1 && endTagIdx < endIdx) {
    endIdx = endTagIdx
  }

  const raw = context.remaining(endIdx)
  context.advance(raw.length)

  if (!context.eof) {
    context.advance(3)
  }

  return {
    type: NodeType.COMMENT,
    content: raw,
  }
}

export function parseTag(context: ParserContext, start: boolean = true): ElementNode {
  const match = (
    start
      ? /^<(\p{ID_Start}[\p{ID_Continue}:.$@\-]*)/u
      : /^<\/(\p{ID_Start}[\p{ID_Continue}:.$@\-]*)/u
  ).exec(context.remaining())

  if (!match) {
    console.error('[eich/parser debug] ', context)
    throw new Error(`[eich/parser] not found starting/ending tag at input:${context.idx}`)
  }

  const tag = match[1]
  context.advance(match[0].length)
  context.trim()
  const attributes = parseAttributes(context)
  const selfClosing = context.startsWith('/>')
  context.advance(selfClosing ? 2 : 1)

  return {
    type: NodeType.ELEMENT,
    tag,
    selfClosing,
    attributes,
    children: [],
  }
}

export function parseAttributes(context: ParserContext): AttributeNode[] {
  const attrs: AttributeNode[] = []

  while (!context.startsWith('>') && !context.startsWith('/>')) {
    const match = /^[\p{ID_Start}@:$][\p{ID_Continue}@:$\-]*/u.exec(context.remaining())
    if (!match) {
      console.error('[eich/parser debug] ', context)
      throw new Error(`[eich/parser] unexpected attribute name at input:${context.idx}`)
    }

    const name = match[0]

    context.advance(name.length)
    context.trim()

    if (!context.startsWith('=')) {
      attrs.push({
        type: NodeType.ATTRIBUTE,
        name,
        value: '',
        raw: '',
      })

      continue
    }

    context.advance(1) // =
    context.trim()

    let value = ''
    const quote = context.char()
    if (quote == '\'' || quote == '"') {
      context.advance(1)
      const valueIdx = context.indexOf(quote)
      if (valueIdx == -1) {
        console.error('[eich/parser debug] ', context)
        throw new Error(`[eich/parser] unclosed attribute value quote at input:${context.idx}`)
      }

      value = context.remaining(valueIdx)
      context.advance(value.length + 1)
    }
    else {
      [value] = /^\p{ID_Start}[\p{ID_Continue}\-:]*/u.exec(context.remaining())!
      context.advance(value.length)
    }

    context.trim()

    attrs.push({
      type: NodeType.ATTRIBUTE,
      name,
      value: parseEntities(value, { attribute: true }),
      raw: value,
    })
  }

  return attrs
}

export function parseElement(context: ParserContext, ancestors: Node[]): ElementNode {
  const element = parseTag(context)
  if (element.selfClosing) {
    return element
  }

  const mode = context.resolver(element.tag)

  if (mode == TextMode.RAWTEXT) {
    const endIdx = context.indexOf(`</${element.tag}`)
    if (endIdx == -1) {
      console.error('[eich/parser debug] ', context)
      throw new Error(`[eich/parser] unclosed rawtext element tag <${element.tag}> at input:${context.idx}`)
    }
    const raw = context.remaining(endIdx)
    context.advance(raw.length)
    element.raw = raw
  }
  else if (mode == TextMode.DATA || mode == TextMode.RCDATA) {
    let oldMode = context.mode
    ancestors.push(element)
    context.mode = mode
    element.children = parseChildren(context, ancestors)
    ancestors.pop()
    context.mode = oldMode
  }
  else {
    console.error('[eich/parser debug] ', context)
    throw new Error(`[eich/parser] unknown text mode ${mode} at input:${context.idx}`)
  }

  if (!context.eof) {
    const endTag = parseTag(context, false)
    if (endTag.tag != element.tag) {
      console.error('[eich/parser debug] ', context)
      throw new Error(`[eich/parser] unclosed element tag <${element.tag}> (but found </${endTag.tag}>) at input:${context.idx}`)
    }
  }
  else {
    console.error('[eich/parser debug] ', context)
    throw new Error(`[eich/parser] unclosed element tag <${element.tag}> (unexpected EOF) at input:${context.idx}`)
  }

  return element
}

export function parseValue(context: ParserContext): ValueNode {
  context.advance(2)
  const endIdx = context.indexOf('}}')
  if (endIdx == -1) {
    console.error('[eich/parser debug] ', context)
    throw new Error(`[eich/parser] unclosed interpolation block at input:${context.idx}`)
  }
  const raw = context.remaining(endIdx)
  context.advance(raw.length + 2)
  return {
    type: NodeType.VALUE,
    value: raw,
  }
}

export function parseText(context: ParserContext): TextNode {
  let endIdx = context.source.length
  const ltIdx = context.indexOf('<')
  const valIdx = context.indexOf('{{')

  if (ltIdx != -1 && ltIdx < endIdx) {
    endIdx = ltIdx
  }

  if (valIdx != -1 && valIdx < endIdx) {
    endIdx = valIdx
  }

  const raw = context.remaining(endIdx)
  context.advance(raw.length)

  return {
    type: NodeType.TEXT,
    content: parseEntities(raw),
    raw,
  }
}

export function parseChildren(context: ParserContext, ancestors: Node[]) {
  const nodes: ChildNode[] = []
  while (!isEnd(context, ancestors)) {
    let node: ChildNode | null = null

    if (context.mode == TextMode.DATA || context.mode == TextMode.RCDATA) {
      if (context.mode == TextMode.DATA && context.char(0) == '<') {
        if (context.char(1) == '!') {
          if (context.startsWith('<![CDATA[')) {
            node = parseCDATA(context)
          }
          else if (context.startsWith('<!--')) {
            node = parseComment(context)
          }
          else {
            throw new Error('unexpected <!')
          }
        }
        else if (context.char(1) == '/') {
          // Unclosed Tag
          console.error('[eich/parser debug] ', context)
          throw new Error(`[eich/parser] unexpected ending tag at input:${context.idx}`)
        }
        else if (/\p{ID_Start}/u.test(context.char(1))) {
          node = parseElement(context, ancestors)
        }
      }
      else if (context.startsWith('{{')) {
        node = parseValue(context)
      }
    }

    if (node == null) {
      node = parseText(context)
    }

    nodes.push(node)
  }

  return nodes
}

export function parseDocument(context: ParserContext): DocumentNode {
  return {
    type: NodeType.DOCUMENT,
    children: parseChildren(context, []),
  }
}

export interface ParseOptions {
  resolver?: ModeResolver
  startPos?: number
  initialMode?: TextMode
}

export function parse(source: string, { startPos, resolver, initialMode }: ParseOptions = {}): DocumentNode {
  const context = new ParserContext(source, startPos, initialMode, resolver)
  return parseDocument(context)
}
