import { EichBasicNode, props as properties, resolveSlots, template } from "@eich/renderer";
import { defineComponent } from "@eich/renderer";

export type EichFormNode = EichBasicNode<'form', {
  action?: string
  method?: string
}>

export const component = defineComponent<EichFormNode>((props, slots) => {
  return () => resolveSlots(
    slots(),
    template`<form ${properties(props)}><slot/></form>`
  )
})

export default component 