import { ref } from "@vue/reactivity";
import { getActiveContext, setActiveContext } from "../context";
import { defineComponent, RegistryComponent } from "../renderer";
import { reactiveHtml } from "../utils";
import { EichBasicNode } from "../node";

export const component = defineComponent<EichBasicNode<'ref', {
  key: string
  value: any
}>>(({ key, value }) => (context) => {
  setActiveContext(key, ref(value))
  
  return null
})

RegistryComponent.register('ref', component)
export default component
