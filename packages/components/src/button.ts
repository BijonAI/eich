import { EichBasicNode, resolveSlots, template } from "@eich/renderer";
import { defineComponent } from "@eich/renderer";

export type EichButtonNode = EichBasicNode<'button'>

export const component = defineComponent<EichButtonNode>((_, slots) => {
  return () => resolveSlots(
    slots(),
    template`<button><slot/></button>`
  )
})

export default component
