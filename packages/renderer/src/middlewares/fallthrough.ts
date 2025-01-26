import { _setRxAttr } from "../html";
import { defineMiddleware, getComponentOptions, Context, createAdhoc, middlewares } from "../renderer";
import { kTextNode } from "../resolver";

export interface FallthroughOptions {
  fallthrough: boolean
}

function isBindableAttr(name: string): boolean {
  return /^([^$#]|[:@])?\p{ID_Start}[\p{ID_Continue}_\-]*$/u.test(name) || /^@\p{ID_Start}[\p{ID_Continue}_\-:]*$/u.test(name)
}

function bindAttrs(ctx: Context, attrs: Record<string, any>, node: any) {
  for (let key in attrs) {
    key = key.trim()

    if (!isBindableAttr(key)) {
      continue
    }

    _setRxAttr(node, key, /^[:@]/.test(key) && typeof attrs[key] == 'string' ? createAdhoc(attrs[key], ctx) : attrs[key])
  }
}

export const fallthrough = defineMiddleware({
  type: 'post',
  fn(node, ctx, domNode, comp) {
    if (node.tag == kTextNode || node.attrs.length == 0) {
      return
    }

    const fallthrough = getComponentOptions(comp)?.fallthrough ?? false

    if (fallthrough && domNode instanceof Node) {
      bindAttrs(ctx, node.attrs, domNode)
    }
    else if (fallthrough) {
      console.warn(`[eich] fallthrough component (<${node.tag}>) should return a Node object`)
    }
  },
})


middlewares.post.set('fallthrough', fallthrough)