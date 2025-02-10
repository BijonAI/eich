import { isRef, toRefs } from '@vue/reactivity'
import { defineMiddleware, middlewares } from '../renderer'
import { kTextNode } from '../resolver'

const kRefAttrs = Symbol('Ref Attrs')

middlewares.pre.set('ref', defineMiddleware({
  type: 'pre',
  fn(node) {
    if (node.tag != kTextNode && node.attrs.ref != null) {
      (node.attrs as any)[kRefAttrs] = node.attrs.ref
      delete node.attrs.ref
    }
  },
}))

middlewares.post.set('ref', defineMiddleware({
  type: 'post',
  fn(node, ctx, domNode) {
    if (node.tag != kTextNode) {
      const refTarget = (node.attrs as any)?.[kRefAttrs]
      if (typeof refTarget == 'string') {
        const context = toRefs(ctx)
        if (isRef(context[refTarget])) {
          context[refTarget].value = domNode
        }
      }
    }
  },
}))
