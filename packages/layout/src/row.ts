import { defineComponent, intrinsics, ref, template, useAttrs } from "@eich/renderer";
import { ContainerAttributes } from "./container";
import { tmpl } from "./container";

const component = defineComponent<ContainerAttributes>((attrs, children) => {
  return tmpl([
    ref(useAttrs({
      ...attrs,
      'width': attrs.$width ?? '100%',
      'height': attrs.$height ?? '100%',
      'flex-grow': attrs.$grow ?? 1,
      'flex-direction': 'row',
      'display': 'flex',
    }, [
      'padding', 'margin', 'width', 'height', 'flex-grow', 'flex-direction', 'display',
      'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
      'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
    ])),
    children()
  ])
})

intrinsics.set('row', component)
export default component
