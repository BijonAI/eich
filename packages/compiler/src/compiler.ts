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

    let result: MaybeArray<Widget> | null = []

    for (const evaluater of [...evaluaters, ...additionalEvaluaters]) {
      result = await evaluater({
        widget: processedTree,
        context: {
          data: parentData,
          set,
          get,
          resolveChildren: async (children, context) => {
            const resolveds = children.filter((child: EichElement) => !child.compiled).map((child: EichElement) => {
              child.compiled = true
              return compile(child, context.data ?? {})
            })
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
          
          console.log('Processing children:', {
            parentTag: tree.tag,
            uncompiled: tree.children.filter(child => !child.compiled).map(c => c.tag)
          });

          const compiledChildren = await Promise.all(
            [...tree.children].filter(child => !child.compiled).map(child => compile(child, childData))
          );
          
          console.log('Compiled results:', {
            results: compiledChildren.map(child => ({
              isArray: Array.isArray(child),
              hasElement: Array.isArray(child) 
                ? child.some(c => c?.element)
                : child?.element != null
            }))
          });

          if (widget.element instanceof Element) {
            const elementsToAppend = compiledChildren
              .flatMap(child => Array.isArray(child) ? child : [child]) // 展平数组
              .filter(child => child != null) // 过滤null
              .map(child => child.element)
              .filter(element => element != null); // 过滤没有element的项

            console.log('Appending elements:', {
              count: elementsToAppend.length,
              elements: elementsToAppend.map(el => ({
                tagName: el instanceof Element ? el.tagName : 'non-element',
                type: typeof el
              }))
            });

            if (elementsToAppend.length > 0) {
              widget.element.append(...elementsToAppend);
            }
          }
        }
      }
    }

    return result ?? [];
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