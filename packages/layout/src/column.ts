import type { ContainerAttributes, tmpl } from './container'
import { defineComponent, intrinsics, ref, useAttrs } from '@eich/renderer'

const component = defineComponent<ContainerAttributes>((attrs, children) => {
  return tmpl([
    ref(useAttrs({
      ...attrs,
      'width': attrs.$width ?? '100%',
      'height': attrs.$height ?? '100%',
      'flex-grow': attrs.$grow ?? 1,
      'flex-direction': 'column',
      'display': 'flex',
    }, [
      'padding',
      'margin',
      'width',
      'height',
      'flex-grow',
      'flex-direction',
      'display',
      'padding-top',
      'padding-right',
      'padding-bottom',
      'padding-left',
      'margin-top',
      'margin-right',
      'margin-bottom',
      'margin-left',
    ])),
    children(),
  ])
})

intrinsics.set('column', component)
export default component
