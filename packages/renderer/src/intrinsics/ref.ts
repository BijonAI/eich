import { ref } from "@vue/reactivity";
import { setActiveContext } from "../context";
import { defineComponent, RegistryComponent } from "../renderer";
import { EichBasicNode } from "../node";

export const component = defineComponent<EichBasicNode<'ref', {
  key: string
  value: any
}>>(({ key, value }) => (context) => {
  const refValue = ref(value)
  console.log(refValue)
  setActiveContext(key, refValue)
  return null
})

RegistryComponent.register('ref', component)
export default component
