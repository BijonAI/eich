import type { Context } from '../renderer'
import { _setRxAttr } from '../html'
import { createAdhoc, defineMiddleware, getComponentOptions, middlewares } from '../renderer'
import { kTextNode } from '../resolver'

export interface FallthroughOptions {
  fallthrough: boolean
}

function isBindableAttr(name: string): boolean {
  return /^[^$#]?(?:^@\p{ID_Start}[\p{ID_Continue}\-:]*|^:?\p{ID_Start}[\p{ID_Continue}\-:]*)$/u.test(name)
}

function bindAttrs(ctx: Context, attrs: Record<string, any>, node: any) {
  for (let key in attrs) {
    key = key.trim()

    if (!isBindableAttr(key)) {
      continue
    }

    let val: any = attrs[key]
    if (typeof val == 'string') {
      if (key.startsWith(':')) {
        val = () => createAdhoc(val, ctx)()
      }
      else if (key.startsWith('@')) {
        const adhoc = createAdhoc(`function($event){return (${val});}`, ctx)() as any
        val = (ev: any) => {
          const r = adhoc(ev)
          if (typeof r == 'function') {
            r(ev)
          }
        }
      }
    }
    _setRxAttr(node, key, val)
  }
}

export const fallthrough = defineMiddleware({
  type: 'post',
  fn(node, ctx, domNode, comp) {
    if (node.tag == kTextNode || node.attrs.length == 0) {
      return
    }

    const fallthrough = getComponentOptions(comp)?.fallthrough ?? false

    if (fallthrough && domNode instanceof Element) {
      bindAttrs(ctx, node.attrs, domNode)
    }
    else if (fallthrough) {
      console.warn(`[eich] fallthrough component (<${node.tag}>) should return a Node object`)
    }
  },
})

middlewares.post.set('fallthrough', fallthrough)
