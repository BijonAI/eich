import { EichBasicNode } from "../node";
import { style } from "../utils";
import { template } from "../utils";
import { defineComponent, RegistryComponent } from "../renderer";
import { resolveSlots } from "../utils";
import { defineContainerPrefixer, EichContainerNode } from "./container";

export type EichRowNode = EichBasicNode<'row', EichContainerNode['props']>

export const defineRowPrefixer = (props: EichRowNode['props']) => {
  return {
    flexDirection: () => 'row',
    ...defineContainerPrefixer(props),
  }
}

export const component = defineComponent<EichRowNode>((props, slots) => (context) => {
  return resolveSlots(slots(), template`<div style="${style(props, defineRowPrefixer(props))}"><slot/></div>`)
})

RegistryComponent.register('row', component)
export default component