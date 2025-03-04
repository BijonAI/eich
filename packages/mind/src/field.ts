import { defineComponent, toValue } from '@eichjs/renderer'
import { dia, shapes } from '@joint/core'
import { useAttrs } from '@eichjs/renderer'

export interface MindFieldAttributes {
  $width: number
  $height: number
  $background: string
}

const component = defineComponent<MindFieldAttributes>((props, children) => {
  const { width, height, background } = useAttrs(props, ['width', 'height', 'background'])
  const container = document.createElement('div')
  const graph = new dia.Graph({}, {
    cellNamespace: shapes
  })
  const paper = new dia.Paper({
    el: container,
    width: toValue(width),
    height: toValue(height),
    background: {
      color: toValue(background)
    },
    model: graph,
    cellViewNamespace: shapes
  })
})