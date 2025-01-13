import { WidgetEvaluater, EichElement, WidgetContext, WidgetResolver, Widget, MaybeArray } from "./types";
import { createSandbox } from "./utils/sandbox";
import { parse } from "./parse";
import * as reactivity from '@vue/reactivity'

export function createCompiler(evaluaters: Array<WidgetEvaluater<any>>, resolvers: Array<WidgetResolver<any>>) {
  const additionalEvaluaters: Array<WidgetEvaluater> = []
  window.EICH_ENV ?? (window.EICH_ENV = {
    watch: reactivity.watch,
    ref: reactivity.ref,
    reactive: reactivity.reactive,
    computed: reactivity.computed,
    effect: reactivity.effect,
  })

  async function collectVariables(tree: EichElement, parentData: Record<string, any>) {
    for (const resolver of resolvers) {
      await resolver({ widget: tree, context: { data: parentData, set, get } })

      if (tree.children) {
        for (const child of tree.children) {
          await collectVariables(child, parentData);
        }
      }
    }
  }

  function addEvaluater(evaluater: WidgetEvaluater) {
    additionalEvaluaters.push(evaluater)
  }

  async function compile(eich: EichElement | string, parentData: Record<string, any>) {

    let tree: EichElement
    if (typeof eich === "string") {
      tree = parse(eich)
    } else {
      tree = eich
    }

    await collectVariables(tree, parentData);
    
    const sandbox = createSandbox(parentData);

    const processedAttributes = await Promise.all(
      Object.entries(tree.attributes).map(async ([key, value]) => {
        if (value && typeof value === 'object' && (value.type === 'expression' || value.type === 'ref')) {
          try {
            if (value.type === 'ref') return [key, await sandbox.run(`computed(() => ${value.value})`)]
            return [key, await sandbox.run(value.value)]
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

    let result: MaybeArray<Widget> | null = null

    for (const evaluater of [...evaluaters, ...additionalEvaluaters]) {
      result = await evaluater({
        widget: processedTree,
        context: {
          data: parentData,
          set,
          get,
          resolveChildren: async (children, context) => {
            const resolveds = children.map((child: EichElement) => compile(child, context.data ?? {}))
            return (await Promise.all(resolveds))
          }
        },
      })
      if (result !== null) break
    }
    const widgets = Array.isArray(result) ? result : [result]
    for (const widget of widgets) {
      if (widget && widget?.element) {
        if (tree.children && tree.children.length > 0) {
          const childData = {
            ...parentData,
            ...(widget?.injections || {})
          };
          const compiledChildren = await Promise.all(
            [...tree.children].map(child => compile(child, childData))
          );
          if (widget.element instanceof Element) {
            widget.element.append(
              ...compiledChildren.map(child => {
                const children = Array.isArray(child) ? child : [child]
                return children.map(child => child!.element).filter((item) => typeof item !== 'undefined')
              }).filter((item) => typeof item !== 'undefined').flat()
            );
          }
        }
      }
    }

    return result;
  }

  async function set(key: string, value: any, dataContext: Record<string, any> = {}) {
    if (typeof value === 'object' && (value.type === 'expression' || value.type === 'ref') && typeof value.value === 'string') {
      window.EICH_ENV[key] = await createSandbox(dataContext).run(value.type === 'expression' ? value.value : `ref(${value.value})`)
    } else {
      window.EICH_ENV[key] = value
    }
    console.log(window.EICH_ENV)
  }

  function get(key: string) {
    return window.EICH_ENV[key]
  }

  return {
    compile,
    addEvaluater,
    parse,
    set,
    get,
  }
}