import { defineComponent, intrinsics, ref, template, useAttrs } from "@eich/renderer"

export interface ContainerAttributes {
  $padding: string
  $margin: string
  '$padding-top': string
  '$padding-right': string
  '$padding-bottom': string
  '$padding-left': string
  '$margin-top': string
  '$margin-right': string
  '$margin-bottom': string
  '$margin-left': string
  $grow: string
  $width: string
  $height: string
}

export const tmpl = template`<div :style=${0}>${1}</div>`

const component = defineComponent<ContainerAttributes>((attrs, children) => {
  return tmpl([
    ref(useAttrs({
      ...attrs,
      'display': 'flex',
      'width': attrs.$width ?? '100%',
      'height': attrs.$height ?? '100%',
      'flex-grow': attrs.$grow ?? 1,
    }, [
      'padding', 'margin', 'width', 'height', 'flex-grow', 'display',
      'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
      'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    ])),
    children()
  ])
})

intrinsics.set('container', component)
export default component
