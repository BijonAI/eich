import { animate } from "./animate";

export function rotate([ angle ]: [number], node?: Node) {
  if (!node) return console.error('[eich] Node is required')
  return async (dur: number, ease: (t: number) => number) => {
    await animate((progress) => {
      ;(node as HTMLElement).style.rotate = `${angle * progress}deg`
    }, dur, ease)
  }
}
