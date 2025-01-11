import { WidgetResolver, EichElement, VElement, WidgetContext, WidgetPresolver } from "./types";
import { virtualize } from "./virsualize";
import { createSandbox } from "./utils/sandbox";

export function createCompiler(resolvers: Array<WidgetResolver>, presolvers: Array<WidgetPresolver>) {
  const additionalResolvers: Array<WidgetResolver> = []
  let globalData: Record<string, any> = {}

  async function collectVariables(tree: EichElement, parentData: Record<string, any>) {
    for (const presolver of presolvers) {
      
      const context = presolver({ widget: tree, context: { data: parentData, global: globalData, resolvers: [...resolvers, ...additionalResolvers] } })
      
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
        children: [],
        parent
      };
    }

    const elements: EichElement[] = [];
    let currentIndex = 0;

    while (currentIndex < xml.length) {
      const remainingXml = xml.slice(currentIndex);
      
      // 检查自闭合标签
      const selfClosingMatch = remainingXml.match(/^<([^\s/>]+)([^>]*?)\/>/);
      if (selfClosingMatch) {
        const [fullMatch, tagName, attributesStr] = selfClosingMatch;
        elements.push({
          tag: tagName,
          attributes: parseAttributes(attributesStr.trim()),
          children: [],
          parent
        });
        currentIndex += fullMatch.length;
        continue;
      }

      // 处理普通标签
      const startTagMatch = remainingXml.match(/^<([^\s>]+)([^>]*)>/);
      if (!startTagMatch) {
        // 如果没有找到开始标签，可能是文本内容
        const textContent = remainingXml.match(/^[^<]+/);
        if (textContent) {
          elements.push({
            tag: 'text-content',
            attributes: { content: textContent[0].trim() },
            children: [],
            parent
          });
          currentIndex += textContent[0].length;
        } else {
          currentIndex++;
        }
        continue;
      }

      const [fullMatch, tagName, attributesStr] = startTagMatch;
      const endTag = `</${tagName}>`;
      
      // 找到对应的结束标签
      let endIndex = -1;
      let depth = 1;
      let searchStartIndex = currentIndex + fullMatch.length;

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

      const innerContent = xml.slice(currentIndex + fullMatch.length, endIndex);
      const element: EichElement = {
        tag: tagName,
        attributes: parseAttributes(attributesStr.trim()),
        children: [],
        parent
      };

      // 递归解析子内容
      const children = splitTopLevelTags(innerContent).map(child => parse(child, element));
      element.children = children;
      elements.push(element);

      currentIndex = endIndex + endTag.length;
    }

    // 如果只有一个元素，直接返回它
    if (elements.length === 1) {
      return elements[0];
    }

    // 如果有多个元素，创建一个根元素包含它们
    return {
      tag: 'fragment',
      attributes: {},
      children: elements,
      parent
    };
  }

  function splitTopLevelTags(content: string): string[] {
    const result: string[] = [];
    let current = '';
    let depth = 0;
    let inTag = false;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];

      if (char === '<') {
        // 检查是否是自闭合标签
        const remainingContent = content.slice(i);
        if (remainingContent.match(/^<[^>]*?\/>/)) {
          inTag = true;
        } else if (content[i + 1] === '/') {
          depth--;
          inTag = false;
        } else {
          if (depth === 0 && current.trim()) {
            result.push(current.trim());
            current = '';
          }
          depth++;
          inTag = true;
        }
      }

      current += char;

      // 处理自闭合标签的结束
      if (inTag && char === '>' && content[i - 1] === '/') {
        if (depth === 0 && current.trim()) {
          result.push(current.trim());
          current = '';
        }
        inTag = false;
      }
      // 处理普通标签的结束
      else if (char === '>' && !inTag) {
        if (depth === 0 && current.trim()) {
          result.push(current.trim());
          current = '';
        }
      }
    }

    if (current.trim()) {
      result.push(current.trim());
    }

    return result.filter(tag => tag.length > 0);
  }

  function kebabToCamelCase(str: string): string {
    return str.replace(/-([a-x])/g, (_, letter) => letter.toUpperCase());
  }

  function parseAttributes(attrStr: string): Record<string, any> {
    const attrs: Record<string, any> = {};
    const matches = attrStr.match(/([^\s=]+)(?:="([^"]*)")?/g) || [];

    matches.forEach(match => {
      const [key, value] = match.split('=');
      if (key) {
        // 转换属性名为驼峰式
        const camelKey = kebabToCamelCase(key);
        
        // 检查是否是表达式属性（以$开头）
        if (key.startsWith('$')) {
          const actualKey = camelKey.slice(1); // 移除$前缀
          attrs[actualKey] = {
            type: 'expression ',
            value: value ? value.replace(/"/g, '') : ''
          };
        } else {
          attrs[camelKey] = value ? value.replace(/"/g, '') : '';
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
          try {
            const evaluatedValue = await sandbox.run(value.value)
            return [key, evaluatedValue]
          } catch {
            return [key, value]
          }
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
      result = await resolver({
        widget: processedTree,
        context: {
          data: parentData,
          global: globalData,
          resolvers: [...resolvers, ...additionalResolvers],
          resolveChildren: async (children, context) => {
            const resolveds = await Promise.all(children.map(child => compile(child, context.data ?? {})))
            return resolveds.filter(Boolean).map(resolved => resolved!.widget)
          }
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
