import type { EffectScope } from '@vue/reactivity'
import type { EichIfNode } from '../resolver'
import { effect, effectScope } from '@vue/reactivity'
import {
  builtins,
  createAdhoc,
  defineComponent,
  getCurrentContext,
  patch,
  renderNode,
  runInContext,
} from '../renderer'

interface BranchCondition {
  condition: (context: any) => boolean
  render: () => Node[]
}

const component = defineComponent(
  (_attr, _children, astNode) => {
    const node = astNode as EichIfNode
    const context = getCurrentContext()
    const container = document.createElement('span')
    let scope: EffectScope

    if (!node.attrs.$condition) {
      throw new Error('[eich/if] Missing $condition attribute')
    }

    const branches: BranchCondition[] = [
      {
        condition: createAdhoc(node.attrs.$condition),
        render: () => node.children.flatMap(renderNode),
      },
    ]

    if (node.elif?.length) {
      for (const elifNode of node.elif) {
        if (!elifNode.attrs.$condition) {
          throw new Error('[eich/if] Missing $condition in elif branch')
        }
        branches.push({
          condition: createAdhoc(elifNode.attrs.$condition),
          render: () => elifNode.children.flatMap(renderNode),
        })
      }
    }

    if (node.else) {
      branches.push({
        condition: () => true,
        render: () => node.else!.children.flatMap(renderNode),
      })
    }

    effect(() => {
      scope?.stop()
      scope = effectScope()
      const root = document.createElement('span')

      runInContext(context, () => {
        try {
          const matchedBranch = branches.find(branch => branch.condition(context))
          if (matchedBranch) {
            scope!.run(() => {
              const fragment = document.createDocumentFragment()
              fragment.append(...matchedBranch.render())
              root.append(...fragment.childNodes)
            })
          }
        }
        catch (error) {
          console.error('[eich/if] Render error:', error)
          scope?.stop()
        }
      })

      patch(container, root, { childrenOnly: true })
    })

    return container
  },
)

builtins.set('if', component)

export default component
