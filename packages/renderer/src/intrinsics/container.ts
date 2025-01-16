import { EichBasicNode } from "../node"
import { defineComponent } from "../renderer"
import { RegistryComponent } from "../renderer"
import { style, template } from "../utils"
import { resolveSlots } from "../utils"

export type EichContainerNode = EichBasicNode<'container', {
  grow?: number
  align?: 'center' | 'left' | 'right'
  baseline?: 'center' | 'top' | 'bottom'
}>

export const defineContainerPrefixer = (props: EichContainerNode['props']) => {
  return {
    width: '100%',
    height: '100%',
    flexGrow: () => props.grow?.toString(),
    display: () => 'flex',
    alignItems: () => props.align ? props.align === 'center' ? 'center' : props.align === 'left' ? 'flex-start' : 'flex-end' : undefined,
    justifyContent: () => props.baseline ? props.baseline === 'center' ? 'center' : props.baseline === 'top' ? 'flex-start' : 'flex-end' : undefined,
  }
}

export const component = defineComponent<EichContainerNode>((props, slots) => (context) => {
  return resolveSlots(
    slots(),
    template`<div style="${style<EichContainerNode['props']>(props, defineContainerPrefixer(props))}"><slot/></div>`
  )
})

RegistryComponent.register('container', component)
export default component
