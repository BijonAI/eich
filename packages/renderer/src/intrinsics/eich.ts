import { ref, Ref } from "@vue/reactivity"
import { defineComponent, RegistryComponent } from "../renderer"
import { reactiveHtml } from "../utils"
import { EichBasicNode } from "../node"

export const eich = defineComponent<EichBasicNode<'eich', {
  width: Ref<number>
  height: Ref<number>
}>>(({ width, height }, slots) => (context) => {
  const test = slots()[1]
  
  return reactiveHtml`<div style="width: ${width.value}px; height: ${height.value}px;">${test}</div>`
})

RegistryComponent.register('eich', eich)
export default eich
