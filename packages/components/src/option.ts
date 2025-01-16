import { EichBasicNode, props as properties, resolveSlots, template } from "@eich/renderer";
import { defineComponent } from "@eich/renderer";

export type EichOptionNode = EichBasicNode<'option', {
  value: string | number
  selected?: boolean
  disabled?: boolean
}>

export const component = defineComponent<EichOptionNode>((props, slots) => {
  return () => resolveSlots(
    slots(),
    template`<option ${properties(props)}><slot/></option>`
  )
})

export default component 