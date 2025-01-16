import { EichBasicNode, props as properties, resolveSlots, template } from "@eich/renderer";
import { defineComponent } from "@eich/renderer";

export type EichLineNode = EichBasicNode<'line', {
  x1: number
  y1: number
  x2: number
  y2: number
}>

export const component = defineComponent<EichLineNode>((props, slots) => {
  return () => resolveSlots(
    slots(),
    template`<svg width="${Math.abs(props.x2 - props.x1)}" height="${Math.abs(props.y2 - props.y1)}"><line x1="${props.x1}" y1="${props.y1}" x2="${props.x2}" y2="${props.y2}" ${properties(props)}></line></svg>`
  )
})

export default component 