import { createAdhoc, defineComponent, getCurrentContext, intrinsics, style, template } from "@eich/renderer"

export interface ContainerAttributes {
  $padding: string
  $margin: string
  $width: string
  $height: string
}

const tmpl = template`<div :style=${0}></div>`

const component = defineComponent<ContainerAttributes>((attrs, children) => {
  const context = getCurrentContext()
  const padding = createAdhoc(attrs.$padding)
  const margin = createAdhoc(attrs.$margin)
  const width = createAdhoc(attrs.$width)
  const height = createAdhoc(attrs.$height)
  return tmpl([{
    padding: padding(context),
    margin: margin(context),
    width: width(context),
    height: height(context),
  }])
})

intrinsics.set('container', component)
export default component
