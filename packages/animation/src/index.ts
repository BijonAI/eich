import type { Context } from '@eichjs/renderer'
import { createDelegate, defineMiddleware, middlewares } from '@eichjs/renderer'
import { animate } from './animate'
import * as easings from './easing'
import presets from './presets'
import { convertSnakeCaseToCamelCase, splitAnimations } from './utils'

export type Animation = (params: any[], node?: Node) => (dur: number, ease: (t: number) => number) => Promise<void>

export function getAvailableAnimations(context: Context) {
  return {
    ...presets,
    ...Object.fromEntries(Object.entries(context).map(([key, value]) => {
      return [key, (params: [number], _: Node) => {
        return (dur: number, ease: (t: number) => number) => {
          return animate((progress) => {
            context[key] = value + progress * params[0]
          }, dur, ease)
        }
      }]
    })),
  }
}

export function getAvailableEasings(context: Context) {
  return {
    ...easings,
    ...Object.fromEntries(Object.entries(context).map(([key, value]) => {
      if (typeof value === 'function') {
        return [key, value]
      }
      else {
        return [void 0, void 0]
      }
    })),
  }
}

const animation = defineMiddleware({
  type: 'post',
  fn(node, ctx, domNode) {
    if (typeof node.tag !== 'string') {
      return
    }

    const animations = getAvailableAnimations(ctx) as unknown as Record<string, Animation>
    const easings = getAvailableEasings(ctx)

    const events: Record<string, () => Promise<void>> = {}
    Object.entries(node.attrs).forEach(([key, value]: [string, string]) => {
      if (key.startsWith('animate')) {
        const anims = splitAnimations(value)
        let commandName = key.match(/:.+/) ? key.match(/:.+/)![0] : ''
        if (commandName.startsWith(':')) {
          commandName = commandName.slice(1)
        }
        const process = async () => {
          for (const anim of anims) {
            await animations[anim.name as string](anim.params, domNode as Node)(
              anim.dur ?? 1000,
              typeof anim.ease !== 'undefined'
                ? typeof anim.ease === 'string'
                  ? easings[convertSnakeCaseToCamelCase(anim.ease)]
                  : anim.ease
                : (t: number) => t,
            )
          }
        }
        if (commandName.length > 0)
          events[`@${commandName}`] = process
        else process()
      }
    })
    const nodes = Array.isArray(domNode) ? domNode : [domNode]
    nodes.forEach(node => createDelegate(events)(node))
  },
})

middlewares.post.set('animation', animation)

export default animation