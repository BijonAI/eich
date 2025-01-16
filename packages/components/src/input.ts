import { EichBasicNode, props as properties, resolveSlots, template } from "@eich/renderer";
import { defineComponent } from "@eich/renderer";

export type EichInputNode = EichBasicNode<'input', {
  type?: string
  value?: string
  placeholder?: string
}>

export const component = defineComponent<EichInputNode>((props, slots) => {
  return () => resolveSlots(
    slots(),
    template`<input ${properties(props)}>`
  )
})

export default component 