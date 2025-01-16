import { EichBasicNode, props as properties, resolveSlots, template } from "@eich/renderer";
import { defineComponent } from "@eich/renderer";

export type EichSelectNode = EichBasicNode<'select', {
  value?: string | number
  multiple?: boolean
}>

export const component = defineComponent<EichSelectNode>((props, slots) => {
  return () => resolveSlots(
    slots(),
    template`<select ${properties(props)}><slot/></select>`
  )
})

export default component 