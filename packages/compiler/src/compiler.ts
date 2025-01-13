import { WidgetEvaluater, EichElement, WidgetContext, WidgetResolver, Widget } from "./types";
import { createSandbox } from "./utils/sandbox";
import { parse } from "./parse";
import * as reactivity from '@vue/reactivity'

export function createCompiler(evaluaters: Array<WidgetEvaluater<EichElement>>, resolvers: Array<WidgetResolver<EichElement>>) {
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
      const context = await resolver({ widget: tree, context: { data: parentData, set, get } })

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

    console.log(parentData)
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

    let result: Widget | null = null

    for (const evaluater of [...evaluaters, ...additionalEvaluaters]) {
      result = await evaluater({
        widget: processedTree,
        context: {
          data: parentData,
          set,
          get,
          resolveChildren: async (children, context) => {
            const resolveds = await Promise.all(children.map(child => compile(child, context.data ?? {})))
            return resolveds.map(resolved => resolved!.element).filter((item) => typeof item !== 'undefined')
          }
        },
      })
      if (result !== null) break
    }
    if (result?.element) {
      if (tree.children && tree.children.length > 0) {
        const childData = {
          ...parentData,
          ...(result?.injections || {})
        };

        const compiledChildren = await Promise.all(
          [...tree.children].map(child => compile(child, childData))
        );

        result!.element.append(
          ...compiledChildren.map(child => child!.element).filter((item) => typeof item !== 'undefined')
        );
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