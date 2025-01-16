import { defineComponent, RegistryComponent } from "../renderer";
import { resolveSlots } from "../utils"
import { template } from "../utils"
import { EichBasicNode } from "../node";
import { getActiveContext, setActiveContext } from "../context";

export type Conditionable = boolean | 0 | 1 | 'true' | 'false' | '0' | '1' | null | undefined

export const componentIf = defineComponent<EichBasicNode<'if', {
  condition: Conditionable
}>>(({ condition }, slots) => (context) => {
  setActiveContext('condition', condition)
  return condition ? resolveSlots(slots(), template`<div><slot/></div>`) : null
})

export const componentElif = defineComponent<EichBasicNode<'elif', {
  condition: Conditionable
}>>(({ condition }, slots) => (context) => {
  const { condition: prevCondition } = getActiveContext()
  setActiveContext('condition', condition)
  return prevCondition ? null : condition ? resolveSlots(slots(), template`<div><slot/></div>`) : null
})

export const componentElse = defineComponent<EichBasicNode<'else'>>((_, slots) => (context) => {
  const { condition } = getActiveContext()
  return condition ? null : resolveSlots(slots(), template`<div><slot/></div>`)
})

RegistryComponent.register('if', componentIf)
RegistryComponent.register('elif', componentElif)
RegistryComponent.register('else', componentElse)
