import { builtins, defineComponent, getCurrentContext } from '@eich/renderer'

export interface LineAttributes {
  $x1?: number
  $y1?: number
  $x2?: number
  $y2?: number
}

export const component = defineComponent<LineAttributes>((attrs, children) => {
  const { _IS_IN_FIELD_TAG } = getCurrentContext()
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
  line.setAttribute('x1', attrs.$x1?.toString() ?? '0')
  line.setAttribute('y1', attrs.$y1?.toString() ?? '0')
  line.setAttribute('x2', attrs.$x2?.toString() ?? '0')
  line.setAttribute('y2', attrs.$y2?.toString() ?? '0')
  line.append(...children())

  if (!_IS_IN_FIELD_TAG) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const width = Math.abs((attrs.$x2 ?? 0) - (attrs.$x1 ?? 0))
    const height = Math.abs((attrs.$y2 ?? 0) - (attrs.$y1 ?? 0))
    svg.setAttribute('width', width.toString())
    svg.setAttribute('height', height.toString())
    svg.append(line)
    return svg
  }
  return line
})

builtins.set('line', component)

export default component
