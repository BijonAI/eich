import { EichBasicNode, props as properties, resolveSlots, template } from "@eich/renderer";
import { defineComponent } from "@eich/renderer";

export type EichTextareaNode = EichBasicNode<'textarea', {
  rows?: number
  cols?: number
  value?: string
  placeholder?: string
}>

export const component = defineComponent<EichTextareaNode>((props, slots) => {
  return () => resolveSlots(
    slots(),
    template`<textarea ${properties(props)}><slot/></textarea>`
  )
})

export default component 