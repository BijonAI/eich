import { EichBasicNode, props as properties, resolveSlots, template } from "@eich/renderer";
import { defineComponent } from "@eich/renderer";

export type EichCircleNode = EichBasicNode<'circle', {
  r: number
}>

export const component = defineComponent<EichCircleNode>((props, slots) => {
  return () => resolveSlots(
    slots(),
    template`<svg width="${props.r * 2}" height="${props.r * 2}"><circle cx="${props.r}" cy="${props.r}" r="${props.r}" ${properties(props)}></circle></svg>`
  )
})

export default component 