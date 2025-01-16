import { EichBasicNode, props as properties, resolveSlots, template } from "@eich/renderer";
import { defineComponent } from "@eich/renderer";

export type EichRectNode = EichBasicNode<'rect', {
  width: number
  height: number
}>

export const component = defineComponent<EichRectNode>((props, slots) => {
  return () => resolveSlots(
    slots(),
    template`<svg width="${props.width}" height="${props.height}"><rect width="100%" height="100%" ${properties(props)}></rect></svg>`
  )
})

export default component
