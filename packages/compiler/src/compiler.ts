import { WidgetResolver, EichElement, VElement, WidgetContext, WidgetPresolver } from "./types";
import { createSandbox } from "./utils/sandbox";
import { parse } from "./parse";

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
