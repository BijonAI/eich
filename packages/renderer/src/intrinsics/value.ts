import { Ref, watch } from "@vue/reactivity";
import { EichBasicNode } from "../node";
import { defineComponent, RegistryComponent } from "../renderer";
import { reactiveHtml } from "../utils";

export const component = defineComponent<EichBasicNode<"value", {
  data: Ref<unknown>
}>>(props => {
  return (context) => {
    return reactiveHtml`<div>${props.data}</div>`
  }
})

RegistryComponent.register('value', component)
export default component
