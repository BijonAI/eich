import { builtins, defineComponent, getCurrentContext } from '@eichjs/renderer'

export interface PathAttributes {
  $d?: string
}

export const component = defineComponent<PathAttributes>((attrs, children) => {
  const { _IS_IN_FIELD_TAG } = getCurrentContext()
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', attrs.$d ?? '')
  path.append(...children())

  if (!_IS_IN_FIELD_TAG) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const bbox = path.getBBox()
    svg.setAttribute('width', bbox.width.toString())
    svg.setAttribute('height', bbox.height.toString())
    svg.append(path)
    return svg
  }
  return path
})

builtins.set('path', component)

export default component
