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
  FRAGMENT,
}

export type ChildNode =
  | ElementNode
  | TextNode
  | CDATANode
  | CommentNode
  | ValueNode
  | DocumentNode
  | FragmentNode

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
  filename: string
  raw: string
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

export interface FragmentNode {
  type: NodeType.FRAGMENT;
  children: ChildNode[];
}

export class ParserContext {
  public readonly lines: string[];
  public readonly lineStarts: number[];
  public ancestors: [ElementNode | FragmentNode, Position][] = [];

  constructor(
    public readonly source: string,
    public readonly filename: string = '<anonymous>',
    public idx: number = 0,
    public mode: TextMode = TextMode.DATA,
    public resolver: ModeResolver = () => TextMode.DATA,
  ) {
    this.lines = source.split('\n');
    this.lineStarts = [];
    let index = 0;
    for (let i = 0; i < this.lines.length; i++) {
      this.lineStarts.push(index);
      index += this.lines[i].length + 1; // +1 for the newline character
    }
  }

  getPosition(offset: number = 0): Position {
    const pos = this.idx + offset;
    let line = 1;
    let lastLineStart = 0;

    let left = 0;
    let right = this.lineStarts.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (this.lineStarts[mid] <= pos) {
        lastLineStart = this.lineStarts[mid];
        line = mid + 1;
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return {
      line,
      column: pos - lastLineStart + 1,
      idx: pos
    };
  }

  push(node: ElementNode | FragmentNode) {
    this.ancestors.push([node, this.getPosition()])
  }

  pop() {
    this.ancestors.pop()
  }

  getLines(startLine: number, endLine: number): string[] {
    return this.lines.slice(startLine - 1, endLine);
  }

  remaining(end?: number): string {
    return this.source.slice(this.idx, end)
  }

  slice(start?: number, end?: number): string {
    return this.source.slice(start, end)
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
    const match = WHITESPACE_REG.exec(this.source.slice(this.idx))

    if (match) {
      this.idx += match[0].length
    }
  }
}

export type ModeResolver = (tag: string) => TextMode

export function isEnd(context: ParserContext): boolean {
  if (context.eof) {
    return true
  }

  const parent = context.ancestors[context.ancestors.length - 1]?.[0]
  if (
    parent 
    && (
      parent.type == NodeType.ELEMENT && context.startsWith(`</${parent.tag}`)
      || parent.type == NodeType.FRAGMENT && context.startsWith('</>')
    )
  ) {
    return true
  }

  return false
}

export function parseCDATA(context: ParserContext): CDATANode {
  context.advance(9)
  const endIdx = context.indexOf(']]>')
  if (endIdx == -1) {
    context.idx = context.source.length
    throw new ParserError('Unclosed CDATA section', context, 'UNCLOSED_CDATA')
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

const TAG_START_REG = /^<(\p{ID_Start}[\p{ID_Continue}:.$@\-]*)/u;
const TAG_END_REG = /^<\/(\p{ID_Start}[\p{ID_Continue}:.$@\-]*)/u;
const ATTR_NAME_REG = /^[\p{ID_Start}@:$][\p{ID_Continue}@:$\-]*/u;
const WHITESPACE_REG = /^[\t\r\n\f ]+/;

export function parseTag(context: ParserContext, start: boolean = true): ElementNode {
  const match = (
    start
      ? TAG_START_REG
      : TAG_END_REG
  ).exec(context.remaining())

  if (!match) {
    throw new ParserError(
      start ? 'Invalid opening tag' : 'Invalid closing tag',
      context,
      'INVALID_TAG_NAME'
    )
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
    const match = ATTR_NAME_REG.exec(context.remaining())
    if (!match) {
      throw new ParserError('Invalid attribute name', context, 'INVALID_ATTRIBUTE_NAME')
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
        throw new ParserError('Unclosed attribute value quotation', context, 'UNCLOSED_ATTRIBUTE_VALUE')
      }

      value = context.remaining(valueIdx)
      context.advance(value.length + 1)
    }
    else {
      [value] = ATTR_NAME_REG.exec(context.remaining())!
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

export function parseElement(context: ParserContext): ElementNode {
  const element = parseTag(context);
  if (element.selfClosing) {
    return element;
  }

  const mode = context.resolver(element.tag);
  const oldMode = context.mode;

  try {
    context.push(element);
    context.mode = mode;
    element.children = parseChildren(context);

    if (!context.eof) {
      const endTag = parseTag(context, false);
      if (endTag.tag !== element.tag) {
        throw new ParserError(
          `Mismatched closing tag: expected </${element.tag}> but found </${endTag.tag}>`,
          context,
          'MISMATCHED_CLOSING_TAG'
        );
      }
    }
  } finally {
    context.pop();
    context.mode = oldMode;
  }

  return element;
}

export function parseValue(context: ParserContext): ValueNode {
  context.advance(2)
  const endIdx = context.indexOf('}}')
  if (endIdx == -1) {
    context.idx = context.source.length
    throw new ParserError('Unclosed interpolation expression', context, 'UNCLOSED_INTERPOLATION')
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

  const rawMode = context.mode != TextMode.DATA
    && context.ancestors.length > 0
    && context.ancestors[context.ancestors.length - 1][0].type == NodeType.ELEMENT

  if (rawMode) {
    if (context.mode == TextMode.CDATA) {
      throw new ParserError('Direct text parsing not supported in CDATA mode', context, 'INVALID_CDATA_MODE')
    }

    let nextIdx = context.indexOf('</')
    while (nextIdx != -1) {
      const remaining = context.slice(nextIdx)
      const match = remaining.match(TAG_END_REG)
      const ancestor = context.ancestors[context.ancestors.length - 1][0]
      if (match && ancestor.type == NodeType.ELEMENT && match[1] == ancestor.tag) {
        endIdx = nextIdx
        break
      }
      nextIdx = context.source.indexOf('</', nextIdx + 2)
    }

    if (nextIdx == -1) {
      context.idx = context.source.length
      throw new ParserError('Unexpected end of file', context, 'UNEXPECTED_EOF')
    }
  }
  else {
    const valIdx = context.indexOf('{{')
    const ltIdx = context.indexOf('<')

    if (ltIdx != -1 && ltIdx < endIdx) {
      endIdx = ltIdx
    }

    if (valIdx != -1 && valIdx < endIdx) {
      endIdx = valIdx
    }
  }


  const raw = context.remaining(endIdx)
  context.advance(raw.length)

  return {
    type: NodeType.TEXT,
    content: context.mode != TextMode.RAWTEXT ? parseEntities(raw) : '',
    raw,
  }
}

export function parseChildren(context: ParserContext) {
  const nodes: ChildNode[] = []
  while (!isEnd(context)) {
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
            throw new ParserError('Invalid <!> markup', context, 'INVALID_MARKUP')
          }
        }
        else if (context.char(1) == '/') {
          throw new ParserError('Unexpected closing tag', context, 'UNEXPECTED_CLOSING_TAG')
        }
        else if (/\p{ID_Start}/u.test(context.char(1))) {
          node = parseElement(context)
        }
        else if (context.char(1) == '>') {
          node = parseFragment(context)
        }
        else {
          throw new ParserError('Invalid opening tag name', context, 'INVALID_TAG_NAME')
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
    children: parseChildren(context),
    filename: context.filename,
    raw: context.source,
  }
}

export interface ParseOptions {
  resolver?: ModeResolver
  startPos?: number
  initialMode?: TextMode
  filename?: string
}

export function parse(source: string, { startPos, resolver, initialMode, filename }: ParseOptions = {}): DocumentNode {
  const context = new ParserContext(source, filename, startPos, initialMode, resolver)
  return parseDocument(context)
}

export class ParserError extends Error {
  constructor(
    message: string,
    public context: ParserContext,
    public code: string = 'PARSER_ERROR'
  ) {
    const position = context.getPosition();
    const preview = getSourcePreview(context);
    super(
      `${message}\n` +
      `Location: ${context.filename}:${position.line}:${position.column} (${position.idx})\n` +
      `Code: ${code}\n` +
      `Ancestors:\n${getAncestorsPreview(context)}` +
      `Preview:\n${preview}\n` +
      `        ${'^'.padStart(position.column)}`
    );
  }
}

export interface Position {
  line: number;
  column: number;
  idx: number;
}

export function getSourcePreview(context: ParserContext): string {
  const pos = context.getPosition();

  const startLine = Math.max(1, pos.line - 2);
  const endLine = Math.min(context.lines.length, pos.line + 1);

  return context.getLines(startLine, endLine)
    .map((line, i) => {
      const lineNum = startLine + i;
      const isErrorLine = lineNum === pos.line;
      const paddedLineNum = lineNum.toString().padStart(4, ' ');
      return `${paddedLineNum} | ${line}${isErrorLine ? ' <--' : ''}`;
    })
    .join('\n');
}

export function getAncestorsPreview(context: ParserContext): string {
  console.log(context.ancestors)
  return context.ancestors.reduce((acc, [node, pos]) => {
    return acc + `   - ${node.type == NodeType.ELEMENT ? `<${node.tag}>` : '(Fragment)'} at ${pos.line}:${pos.column} (${pos.idx})\n`
  }, '')
}

export function parseFragment(context: ParserContext): FragmentNode {
  context.advance(2); // <>

  const fragment: FragmentNode = {
    type: NodeType.FRAGMENT,
    children: [],
  };

  
  context.push(fragment);
  fragment.children = parseChildren(context);
  if (!context.startsWith('</>')) {
    throw new ParserError(
      'Fragment must be closed with </>',
      context,
      'INVALID_FRAGMENT_END'
    );
  }
  context.pop()
  context.advance(3);

  return fragment;
}
