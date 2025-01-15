import { Ref, watch } from "@vue/reactivity";
import { EichBasicNode } from "../node";
import { defineComponent, RegistryComponent } from "../renderer";
import { reactiveHtml } from "../utils";

export const component = defineComponent<EichBasicNode<"value", {
  data: Ref<unknown>
}>>(props => {
  return () => {
    
    const html = reactiveHtml`<div>${props.data}</div>`
    watch(html, (newHtml) => {
      
    })
    return html
  }
})

RegistryComponent.register('value', component)
export default component
