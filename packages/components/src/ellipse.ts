import { EichBasicNode, props as properties, resolveSlots, template } from "@eich/renderer";
import { defineComponent } from "@eich/renderer";

export type EichEllipseNode = EichBasicNode<'ellipse', {
  rx: number
  ry: number
}>

export const component = defineComponent<EichEllipseNode>((props, slots) => {
  return () => resolveSlots(
    slots(),
    template`<svg width="${props.rx * 2}" height="${props.ry * 2}"><ellipse cx="${props.rx}" cy="${props.ry}" rx="${props.rx}" ry="${props.ry}" ${properties(props)}></ellipse></svg>`
  )
})

export default component 