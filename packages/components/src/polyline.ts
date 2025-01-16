import { EichBasicNode, props as properties, resolveSlots, template } from "@eich/renderer";
import { defineComponent } from "@eich/renderer";
import { Point } from './polygon'

export type EichPolylineNode = EichBasicNode<'polyline', {
  points: Point[]
}>

export const component = defineComponent<EichPolylineNode>((props, slots) => {
  const pointsStr = props.points.map(p => `${p.x},${p.y}`).join(' ')
  const width = Math.max(...props.points.map(p => p.x))
  const height = Math.max(...props.points.map(p => p.y))
  
  return () => resolveSlots(
    slots(),
    template`<svg width="${width}" height="${height}"><polyline points="${pointsStr}" ${properties(props)}></polyline></svg>`
  )
})

export default component 