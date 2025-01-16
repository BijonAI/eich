import { computed, MaybeRef, ref, toValue } from "@vue/reactivity";
import { EichBasicNode } from "../node";
import { defineComponent, RegistryComponent } from "../renderer";
import { reactiveHtml, resolveSlots } from "../utils";
import { setActiveContext } from "../context";

export const component = defineComponent<EichBasicNode<'for', {
  key: string
  in: MaybeRef<Iterable<any>>
}>>(({ key, in: iterable }, slots) => (context) => {
  const length = computed(() => Array.from(toValue(iterable)).length)
  const items = computed(() => Array.from(toValue(iterable)))
  const slotSets = items.value.map(item => slots(() => setActiveContext(key, ref(item))))
  
  return computed(() => {
    return slotSets.flatMap(slotSet => resolveSlots(
      slotSet,
      reactiveHtml`${`<div><slot/></div>`}`
    ).value)
  })
})

RegistryComponent.register('for', component)
export default component
