import { WidgetResolver, EichElement, VElement, WidgetContext, WidgetPresolver } from "./types";
import { virtualize } from "./virsualize";
import { createSandbox } from "./utils/sandbox";

export function createCompiler(resolvers: Array<WidgetResolver>, presolvers: Array<WidgetPresolver>) {
  const additionalResolvers: Array<WidgetResolver> = []
  let globalData: Record<string, any> = {}

  async function collectVariables(tree: EichElement, parentData: Record<string, any>) {
    for (const presolver of presolvers) {
      const context = presolver({ widget: tree, context: { data: parentData, global: globalData } })
      if (context === null) continue
      const sandbox = createSandbox({
        ...parentData,
        ...globalData,
      });
      Object.entries(context.global).forEach(async ([key, value]) => {
        globalData[key] = await sandbox.run(value.value)
      })
    }

    if (tree.children) {
      for (const child of tree.children) {
        await collectVariables(child, parentData);
      }
    }
  }

  function parse(xml: string, parent?: VElement): EichElement {
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

    const result: EichElement = {
      tag: tagName,
      attributes: parseAttributes(attributesStr),
      children: [],
      parent,
    };
    const children = splitTopLevelTags(innerContent).map(child => parse(child, result))
    result.children = children

    return result
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
        // Check if the attribute starts with $
        if (key.startsWith('$')) {
          const actualKey = key.slice(1); // Remove the $ prefix
          attrs[actualKey] = {
            type: 'expression',
            value: value ? value.replace(/"/g, '') : ''
          };
        } else {
          attrs[key] = value ? value.replace(/"/g, '') : '';
        }
      }
    });

    return attrs;
  }

  function addResolver(resolver: WidgetResolver) {
    additionalResolvers.push(resolver)
  }

  async function compile(eich: EichElement | string, parentData: Record<string, any>) {
    let tree: EichElement
    if (typeof eich === "string") {
      tree = parse(eich)
    } else {
      tree = eich
    }
    
    await collectVariables(tree, parentData);
    
    const sandbox = createSandbox({
      ...parentData,
      ...globalData,
    });
    
    const processedAttributes = await Promise.all(
      Object.entries(tree.attributes).map(async ([key, value]) => {
        if (value && typeof value === 'object' && value.type === 'expression') {
          const evaluatedValue = await sandbox.run(value.value);
          globalData = {
            ...globalData,
            [key]: evaluatedValue
          };
          return [key, evaluatedValue];
        }
        return [key, value];
      })
    );

    const processedTree = {
      ...tree,
      attributes: Object.fromEntries(processedAttributes)
    };

    let result: {
      widget: VElement,
      context: WidgetContext
    } | null = null;
    
    for (const resolver of [...resolvers, ...additionalResolvers]) {
      result = resolver({
        widget: processedTree,
        context: {
          data: parentData,
          global: globalData
        },
      })
      if (result !== null && result.context.global) {
        globalData = {
          ...globalData,
          ...result.context.global
        }
      }
      if (result !== null) break
    }
    if (result?.widget) {
      result!.widget.children = result!.widget.children || []
      if (tree.children && tree.children.length > 0) {
        const childData = {
          ...parentData,
          ...(result?.context?.data || {})
        };
  
        const compiledChildren = await Promise.all(
          tree.children.map(child => compile(child, childData))
        );
  
        result!.widget.children.push(
          ...compiledChildren.filter(Boolean).map(child => child!.widget)
        );
      }
    }

    return result;
  }

  return {
    compile,
    addResolver,
    parse
  }
}
