import { EichBasicNode, props as properties, resolveSlots, template } from "@eich/renderer";
import { defineComponent } from "@eich/renderer";

export type Point = {
  x: number
  y: number
}

export type EichPolygonNode = EichBasicNode<'polygon', {
  points: Point[]
}>

export const component = defineComponent<EichPolygonNode>((props, slots) => {
  const pointsStr = props.points.map(p => `${p.x},${p.y}`).join(' ')
  const width = Math.max(...props.points.map(p => p.x))
  const height = Math.max(...props.points.map(p => p.y))
  
  return () => resolveSlots(
    slots(),
    template`<svg width="${width}" height="${height}"><polygon points="${pointsStr}" ${properties(props)}></polygon></svg>`
  )
})

export default component 