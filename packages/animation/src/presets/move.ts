import { animate } from '../animate'

export function move([x, y]: [number, number], node?: Node) {
  if (!node)
    return console.error('[eich] Node is required')
  return async (dur: number, ease: (t: number) => number) => {
    await animate((progress) => {
      ;(node as HTMLElement).style.translate = `${x * progress}px ${y * progress}px`
    }, dur, ease)
  }
}
