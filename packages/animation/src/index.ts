import type { Attributes } from '@eich/renderer'
import { createDelegate } from '@eich/renderer'
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
  const animates: Record<string, Animation> = animations as Record<string, Animation>
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
