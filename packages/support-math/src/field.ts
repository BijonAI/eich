import { defineComponent, effect, getCurrentContext, intrinsics, MaybeRef, mergeContext, patch, setCurrentContext, toValue, useAttrs } from "@eich/renderer";
import { field } from "idea-math";

export interface FieldAttributes {
  $width: number
  $height: number
}

const component = defineComponent<FieldAttributes>((props, children) => {
  console.log(props)
  const { width, height } = useAttrs(props, ['width', 'height'])
  const canvas = field(Number(toValue(width)), Number(toValue(height)))
  const node = canvas.node()
  const context = mergeContext(getCurrentContext(), {
    system: canvas,
  })
  setCurrentContext(context)
  children()
  effect(() => {
    canvas.size(Number(toValue(width)), Number(toValue(height)))
    patch(node, canvas.node())
  })
  return node
})

intrinsics.set('field', component)
export default component
