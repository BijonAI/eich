import { EichBasicNode, props as properties, resolveSlots, template } from "@eich/renderer";
import { defineComponent } from "@eich/renderer";

export type EichLabelNode = EichBasicNode<'label', {
  for?: string
}>

export const component = defineComponent<EichLabelNode>((props, slots) => {
  return () => resolveSlots(
    slots(),
    template`<label ${properties(props)}><slot/></label>`
  )
})

export default component 