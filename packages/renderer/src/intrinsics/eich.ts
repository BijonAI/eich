import { ref, Ref, watch } from "@vue/reactivity"
import { defineComponent, RegistryComponent } from "../renderer"
import { reactiveHtml, resolveSlots } from "../utils"
import { EichBasicNode } from "../node"

export const eich = defineComponent<EichBasicNode<'eich', {
  width: Ref<number>
  height: Ref<number>
}>>(({ width, height }, slots) => (context) => {
  return resolveSlots(slots(), reactiveHtml`<div><slot></slot></div>`)
})

RegistryComponent.register('eich', eich)
export default eich
