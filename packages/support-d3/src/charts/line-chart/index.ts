import { defineComponent, intrinsics, toValue, useAttrs } from '@eich/renderer'
import * as d3 from 'd3'

import LineChartTitle from './line-chart-title'
import LineChartXLabel from './line-chart-x-label'
import LineChartYLabel from './line-chart-y-label'

export interface LineChartAttributes {
  '$width'?: string
  '$height'?: string
  '$data'?: string
  '$x-key'?: string
  '$y-key'?: string
  '$curve'?: string
}

const component = defineComponent<LineChartAttributes>((attrs, children) => {
  const { width, height, data, 'x-key': xKey, 'y-key': yKey, curve } = useAttrs(attrs, [
    'width',
    'height',
    'data',
    'x-key',
    'y-key',
    'curve',
  ])

  const margin = { top: 50, right: 50, bottom: 50, left: 50 }
  const innerWidth = Number(toValue(width!)) - margin.left - margin.right
  const innerHeight = Number(toValue(height!)) - margin.top - margin.bottom

  const svg = d3.create('svg')
    .attr('width', toValue(width!))
    .attr('height', toValue(height!))

  const g = svg.append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`)
  const x = d3.scaleLinear<number>()
    .domain(d3.extent(toValue(data)!, d => Number(d[toValue(xKey)! as keyof typeof d])) as [number, number])
    .range([0, innerWidth])

  const y = d3.scaleLinear<number>()
    .domain(d3.extent(toValue(data)!, d => Number(d[toValue(yKey)! as keyof typeof d])) as [number, number])
    .range([innerHeight, 0])

  const curveType = `curve${toValue(curve)!.charAt(0).toUpperCase() + toValue(curve)!.slice(1)}`
  const curveFunction = d3[curveType as keyof typeof d3] as d3.CurveFactory || d3.curveLinear

  const line = d3.line<any>()
    .x(d => x(Number(d[toValue(xKey)!])))
    .y(d => y(Number(d[toValue(yKey)!])))
    .curve(curveFunction)

  g.append('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(x))

  g.append('g')
    .attr('class', 'y-axis')
    .call(d3.axisLeft(y))

  g.append('path')
    .datum(toValue(data)!)
    .attr('class', 'line')
    .attr('d', line)
    .attr('stroke', 'black')
    .attr('fill', 'none')

  const childElements = document.createElement('div')
  childElements.append(...children())
  const title = childElements.querySelector('slot[name="line-chart-title"]')?.innerHTML
  const xLabel = childElements.querySelector('slot[name="line-chart-x-label"]')?.innerHTML
  const yLabel = childElements.querySelector('slot[name="line-chart-y-label"]')?.innerHTML

  if (title) {
    g.append('text')
      .attr('class', 'title')
      .attr('x', innerWidth / 2)
      .attr('y', -margin.top / 2)
      .attr('text-anchor', 'middle')
      .text(title)
  }

  if (xLabel) {
    g.append('text')
      .attr('class', 'x-label')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + margin.bottom - 10)
      .attr('text-anchor', 'middle')
      .text(xLabel)
  }

  if (yLabel) {
    g.append('text')
      .attr('class', 'y-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', -innerHeight / 2)
      .attr('y', -margin.left + 15)
      .attr('text-anchor', 'middle')
      .text(yLabel)
  }

  return svg.node()!
})

intrinsics.set('line-chart', component)

export default component
intrinsics.set('line-chart-title', LineChartTitle)
intrinsics.set('line-chart-x-label', LineChartXLabel)
intrinsics.set('line-chart-y-label', LineChartYLabel)
export { LineChartTitle, LineChartXLabel, LineChartYLabel }
