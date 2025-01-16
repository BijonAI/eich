import { EichBasicNode } from "../node";
import { resolveSlots } from "../utils";
import { defineComponent } from "../renderer";
import { RegistryComponent } from "../renderer";
import { template } from "../utils";
import { style } from "../utils";
import { defineContainerPrefixer, EichContainerNode } from "./container";

export type EichColNode = EichBasicNode<'col', EichContainerNode['props']>

export const defineColPrefixer = (props: EichColNode['props']) => {
  return {
    flexDirection: () => 'column',
    ...defineContainerPrefixer(props),
  }
}

export const component = defineComponent<EichColNode>((props, slots) => (context) => {
  return resolveSlots(slots(), template`<div style="${style(props, defineColPrefixer(props))}"><slot/></div>`)
})

RegistryComponent.register('col', component)
export default component