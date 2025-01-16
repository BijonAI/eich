import { ref, Ref, watch } from "@vue/reactivity"
import { defineComponent, RegistryComponent } from "../renderer"
import { template, resolveSlots } from "../utils"
import { EichBasicNode } from "../node"

export const eich = defineComponent<EichBasicNode<'eich', {
  width: Ref<number>
  height: Ref<number>
}>>(({ width, height }, slots) => (context) => {
  return resolveSlots(slots(),
    template`<div style="width: ${width ?? '100%'}px; height: ${height ?? '100%'}px; position: absolute; top: 0; left: 0; right: 0; bottom: 0;"><slot/></div>`
  )
})

RegistryComponent.register('eich', eich)
export default eich
