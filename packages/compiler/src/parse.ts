import { Parser } from "htmlparser2";
import { EichElement } from "./types";

export function parse(content: string): EichElement {
  let currentElement: EichElement | null = null;
  const stack: EichElement[] = [];
  let root: EichElement | null = null;

  const parser = new Parser({
    onopentag(name, attributes) {
      const element: EichElement = {
        tag: name,
        attributes: {},
        children: [],
        parent: currentElement || undefined
      };

      // 处理属性，转换为驼峰命名
      for (const [key, value] of Object.entries(attributes)) {
        const camelKey = key.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        
        // 处理表达式属性（以$开头）
        if (key.startsWith('$')) {
          const actualKey = camelKey.slice(1); // 移除$前缀
          element.attributes[actualKey] = {
            type: 'expression',
            value: value
          };
        } else {
          element.attributes[camelKey] = value;
        }
      }

      if (currentElement) {
        currentElement.children.push(element);
      } else {
        root = element;
      }

      stack.push(element);
      currentElement = element;
    },

    ontext(text) {
      const trimmedText = text.trim();
      if (trimmedText && currentElement) {
        currentElement.children.push({
          tag: 'text-content',
          attributes: { content: trimmedText },
          children: [],
          parent: currentElement
        });
      }
    },

    onclosetag() {
      stack.pop();
      currentElement = stack[stack.length - 1] || null;
    }
  }, {
    xmlMode: true,  // 启用XML模式以支持自闭合标签
    decodeEntities: true
  });

  parser.write(content);
  parser.end();

  if (!root) {
    // 如果没有根元素，创建一个fragment作为根
    return {
      tag: 'fragment',
      attributes: {},
      children: [],
      parent: undefined
    };
  }

  return root;
}
