import type { Attributes } from '@eich/renderer'
import { createDelegate, getCurrentContext } from '@eich/renderer'
import { animate } from './animate'
import { move } from './move'
import { rotate } from './rotate'
import { scale } from './scale'
import { splitAnimations } from './utils'

export type Animation = (params: any[], node?: Node) => (dur: number, ease: string | ((t: number) => number)) => Promise<void>

export function animateWithAttrs(
  attrs: Attributes,
  animations: any,
  node?: Node,
) {
  const context = getCurrentContext()
  const animates: Record<string, Animation> = {
    ...animations,
    ...Object.fromEntries(Object.entries(getCurrentContext()).map(([key, value]) => {
      return [key, (params: [number], _: Node) => {
        return (dur: number, ease: (t: number) => number) => {
          return animate((progress) => {
            context[key] = value + progress * params[0]
          }, dur, ease)
        }
      }]
    })),
  }
  const events: Record<string, () => Promise<void>> = {}
  Object.entries(attrs).forEach(([key, value]: [string, string]) => {
    if (key.startsWith('animate')) {
      const anims = splitAnimations(value)
      let commandName = key.match(/:.+/) ? key.match(/:.+/)![0] : ''
      if (commandName.startsWith(':')) {
        commandName = commandName.slice(1)
      }
      const process = async () => {
        for (const anim of anims) {
          await animates[anim.name as string](anim.params, node)(anim.dur ?? 1000, anim.ease ?? (t => t))
        }
      }
      if (commandName.length > 0)
        events[`@${commandName}`] = process
      else process()
    }
  })
  return () => createDelegate(events)(node!)
}

export const animation = {
  move,
  scale,
  rotate,
}
export * from './animate'
export * from './move'
export * from './utils'
