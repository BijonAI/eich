import { EichBasicNode, props as properties, resolveSlots, template } from "@eich/renderer";
import { defineComponent } from "@eich/renderer";

export type EichPathNode = EichBasicNode<'path', {
  d: string
  width: number
  height: number
}>

export const component = defineComponent<EichPathNode>((props, slots) => {
  return () => resolveSlots(
    slots(),
    template`<svg width="${props.width}" height="${props.height}"><path d="${props.d}" ${properties(props)}></path></svg>`
  )
})

export default component 