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
  window.EICH_ROOT = { children: [] } as Widget
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

  let currentPositionSet: Array<number> = []
  async function compile(eich: EichElement | string, parentData: Record<string, any>, parent?: Widget): Promise<MaybeArray<Widget>> {
    const currentLevel = currentPositionSet.length
    currentPositionSet[currentLevel] = 0

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
          resolveChildren: async (children, context, widget) => {
            const resolveds = children.filter((child: EichElement) => !child.compiled).map((child: EichElement) => {
              child.compiled = true
              return compile(child, context.data ?? {}, widget)
            })
            return (await Promise.all(resolveds))
          }
        },
      })
      if (result !== null) break
    }
    const widgets = Array.isArray(result) ? result : [result]

    // 根据 currentPositionSet 找到正确的父级位置并插入
    if (currentLevel === 0) {
      // 根级别，直接设置为 EICH_ROOT，但要确保 children 数组结构正确
      window.EICH_ROOT = {
        children: [{
          element: widgets[0]?.element,
          children: widgets.slice(1).filter((widget): widget is Widget => widget != null)
        }]
      }
    } else {
      // 根据位置数组找到正确的父级
      let currentParent = window.EICH_ROOT
      for (let i = 0; i < currentLevel - 1; i++) {
        if (currentParent.children?.[0]?.children?.[currentPositionSet[i]]) {
          currentParent = currentParent.children[0].children[currentPositionSet[i]]
        }
      }

      // 确保父级的结构正确
      if (!currentParent.children) {
        currentParent.children = []
      }

      // 在正确的位置插入或更新 widgets
      const position = currentPositionSet[currentLevel - 1]
      if (widgets.length === 1) {
        // 如果是第一个widget，它应该作为父节点
        if (position === 0) {
          const existingChildren = currentParent.children[0]?.children || [] // 保存现有的子节点
          currentParent.children = [{
            element: widgets[0]?.element,
            ...widgets[0],
            children: existingChildren
          }]
        } else {
          // 非第一个位置的widget应该插入到父节点的children中
          if (!currentParent.children[0]) {
            currentParent.children[0] = { children: [] }
          }
          if (!currentParent.children[0].children) {
            currentParent.children[0].children = []
          }
          currentParent.children[0].children[position - 1] = widgets[0] as Widget
        }
      } else {
        // 多个widget的情况，作为子节点插入
        if (!currentParent.children[0]) {
          currentParent.children[0] = { children: [] }
        }
        if (!currentParent.children[0].children) {
          currentParent.children[0].children = []
        }
        currentParent.children[0].children.splice(
          position - 1, 
          1, 
          ...widgets.filter(widget => widget != null)
        )
      }
    }

    for (const widget of widgets) {
      if (widget && widget?.element) {
        if (tree.children && tree.children.length > 0) {
          const childData = {
            ...parentData,
            ...(widget?.injections || {})
          };
          const compiledChildren = await Promise.all(
            [...tree.children].filter(child => !child.compiled).map((child, index) => {
              // 更新子元素的位置信息
              currentPositionSet[currentLevel] = index
              return compile(child, childData, widget)
            })
          );
          if (widget.element instanceof Element) {
            const elementsToAppend = compiledChildren
              .flatMap(child => Array.isArray(child) ? child : [child]) // 展平数组
              .filter(child => child != null) // 过滤null
              .map(child => child.element)
              .filter(element => element != null); // 过滤没有element的项
            if (elementsToAppend.length > 0) {
              widget.element.append(...elementsToAppend);
            }
          }
        }
      }
    }
    // 处理完当前层级后，移除该层级的位置信息
    currentPositionSet.length = currentLevel
    return result ?? [];
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