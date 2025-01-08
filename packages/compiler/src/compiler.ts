import { WidgetResolver, EichElement, VElement } from "./types";
import { virtualize } from "./virsualize";

export function createCompiler(resolvers: Array<WidgetResolver>) {
  const additionalResolvers: Array<WidgetResolver> = []

  function parse(xml: string): EichElement {
    xml = xml.trim();

    // 处理纯文本
    if (!xml.startsWith('<')) {
      return {
        tag: 'text-content',
        attributes: { content: xml },
        children: []
      };
    }

    // 处理自闭合标签
    if (xml.endsWith('/>')) {
      const tagMatch = xml.match(/<([^\s>]+)/);
      const tagName = tagMatch?.[1] || '';
      return {
        tag: tagName,
        attributes: parseAttributes(xml),
        children: []
      };
    }

    // 处理普通标签
    const startTagMatch = xml.match(/<([^\s>]+)([^>]*)>/);
    if (!startTagMatch) {
      throw new Error('Invalid XML');
    }

    const [fullMatch, tagName, attributesStr] = startTagMatch;
    const endTag = `</${tagName}>`;

    // 找到对应的结束标签
    let endIndex = -1;
    let depth = 1;
    let searchStartIndex = fullMatch.length;

    while (searchStartIndex < xml.length) {
      const nextStart = xml.indexOf(`<${tagName}`, searchStartIndex);
      const nextEnd = xml.indexOf(endTag, searchStartIndex);

      if (nextEnd === -1) break;

      if (nextStart !== -1 && nextStart < nextEnd) {
        depth++;
        searchStartIndex = nextStart + 1;
      } else {
        depth--;
        if (depth === 0) {
          endIndex = nextEnd;
          break;
        }
        searchStartIndex = nextEnd + 1;
      }
    }

    if (endIndex === -1) {
      throw new Error(`Missing closing tag for ${tagName}`);
    }

    const innerContent = xml.slice(fullMatch.length, endIndex);

    return {
      tag: tagName,
      attributes: parseAttributes(attributesStr),
      children: splitTopLevelTags(innerContent).map(child => parse(child))
    };
  }

  function splitTopLevelTags(content: string): string[] {
    const result: string[] = [];
    let current = '';
    let depth = 0;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];

      if (char === '<') {
        if (content[i + 1] === '/') {
          depth--;
        } else {
          if (depth === 0 && current.trim()) {
            result.push(current.trim());
            current = '';
          }
          depth++;
        }
      }

      current += char;

      if (depth === 0 && char === '>') {
        if (current.trim()) {
          result.push(current.trim());
          current = '';
        }
      }
    }

    if (current.trim()) {
      result.push(current.trim());
    }

    return result;
  }

  function parseAttributes(attrStr: string): Record<string, any> {
    const attrs: Record<string, any> = {};
    const matches = attrStr.match(/([^\s=]+)(?:="([^"]*)")?/g) || [];

    matches.forEach(match => {
      const [key, value] = match.split('=');
      if (key) {
        attrs[key] = value ? value.replace(/"/g, '') : '';
      }
    });

    return attrs;
  }

  function addResolver(resolver: WidgetResolver) {
    additionalResolvers.push(resolver)
  }

  function compile(eich: EichElement | string, data: Record<string, any>) {
    let tree: EichElement
    if (typeof eich === "string") {
      tree = parse(eich)
    } else {
      tree = eich
    }
    let result: {
      widget: VElement,
      data: Record<string, any>
    } | null = null
    for (const resolver of [...resolvers, ...additionalResolvers]) {
      result = resolver({
        widget: tree,
        data,
      })
      if (result === null) {
        result = {
          widget: {
            tag: 'div',
            attributes: {},
            children: []
          },
          data: {}
        }
      } else break
    }
    result!.widget.children = result!.widget.children || []

    if (tree.children && tree.children.length > 0) {
      const compiledChildren = tree.children.map(child =>
        compile(child, result!.data)
      ).filter(Boolean)

      result!.widget.children.push(
        ...compiledChildren.map(child => child!.widget)
      )
    }

    return result
  }

  return {
    compile,
    addResolver,
    parse
  }
}
