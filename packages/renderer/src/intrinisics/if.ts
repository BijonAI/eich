import type { EffectScope } from '@vue/reactivity'
import type { EachIfNode } from '../parser'
import { effect, effectScope } from '@vue/reactivity'
import { createAdhoc, defineComponent, getCurrentContext, intrinsics, patch, renderNode, runInContext } from '../renderer'

const component = defineComponent(
  (_attr, _children, astNode) => {
    const node = astNode as EachIfNode
    const container = document.createElement('span')
    const context = getCurrentContext()

    if (!node.attrs.$condition) {
      throw new Error('missing $condition attribute')
    }
    const cond = createAdhoc(node.attrs.$condition)
    let scope: EffectScope

    const elifCond = node.elif && node.elif.map(({ attrs }) => {
      if (!attrs.$condition) {
        throw new Error('missing $condition attribute')
      }

      return createAdhoc(attrs.$condition)
    })

    effect(() => {
      scope?.stop()
      scope = effectScope()
      runInContext(context, () => {
        const root = document.createElement('span')
        if (cond(context)) {
          scope.run(() => root.append(...node.children.flatMap(renderNode)))
          patch(container, root)
          return
        }

        if (node.elif && node.elif.length != 0) {
          for (let i = 0; i < node.elif.length; i += 1) {
            if (elifCond![i](context)) {
              scope.run(() => root.append(...node.elif![i].children.flatMap(renderNode)))
              patch(container, root)
              return
            }
          }
        }

        if (node.else) {
          scope.run(() => root.append(...node.else!.children.flatMap(renderNode)))
          patch(container, root)
        }
      })
    })

    return container
  },
)

intrinsics.set('if', component)

export default component
