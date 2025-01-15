import { EichBasicNode } from "../node";
import { defineComponent, RegistryComponent } from "../renderer";
import { setActiveContext } from "../context";

export const component = defineComponent<EichBasicNode<'var', {
  key: string,
  value: any
}>>(({ key, value }) => (context) => {
  setActiveContext(key, value)
  return null
})

RegistryComponent.register('var', component)
export default component
