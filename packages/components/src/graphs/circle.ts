import { defineComponent, getCurrentContext, intrinsics } from "@eich/renderer"

export interface CircleAttributes {
  $r?: number
  $cx?: number
  $cy?: number
}

export const component = defineComponent<CircleAttributes>((attrs, children) => {
  const { _IS_IN_FIELD_TAG } = getCurrentContext()
})

intrinsics.set('circle', component)

export default component