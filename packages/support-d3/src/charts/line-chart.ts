import { defineComponent, computed, MaybeRef, ComputedRef } from '@eich/renderer'
import { BaseChartNode, Margin } from '../types'
import * as d3 from 'd3'
import { ref, unref } from '@vue/reactivity'

export interface DataPoint {
  [key: string]: number
}

export interface LineChartProps {
  curve?: MaybeRef<'linear' | 'natural' | 'step'>
  strokeWidth?: MaybeRef<number>
  strokeColor?: MaybeRef<string>
}

const DEFAULT_MARGIN: Margin = {
  top: 20,
  right: 20,
  bottom: 30,
  left: 40
}

export type LineChartNode = BaseChartNode<'line-chart', DataPoint, LineChartProps>

export const component = defineComponent<LineChartNode>((props) => {
  const container = ref<HTMLDivElement>()
  
  const chart = computed(() => {
    if (!container.value) {
      container.value = document.createElement('div')
      container.value.className = 'line-chart'
    }
    
    const margin = { ...DEFAULT_MARGIN, ...unref(props.margin) }
    const width = Number(unref(props.width)) - Number(margin.left) - Number(margin.right)
    const height = Number(unref(props.height)) - Number(margin.top) - Number(margin.bottom)
    
    container.value.innerHTML = ''
    const svg = d3.create('svg')
      .attr('width', unref(props.width))
      .attr('height', unref(props.height))
    
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)
    
    const data = unref(props.data)
    const xKey = unref(props.xKey)
    const yKey = unref(props.yKey)
    
    const chartBody = g.append('g')
      .attr('class', 'chart-body')
    
    const x = d3.scaleLinear<number>()
      .domain(d3.extent(data, d => d[xKey]) as [number, number])
      .range([0, width])
    
    const y = d3.scaleLinear<number>()
      .domain(d3.extent(data, d => d[yKey]) as [number, number])
      .range([height, 0])
    
    const line = d3.line<DataPoint>()
      .x(d => x(d[xKey]))
      .y(d => y(d[yKey]))
    
    const curve = unref(props.curve)
    if (curve) {
      const curveType = `curve${curve[0].toUpperCase()}${curve.slice(1)}`
      const curveFunction = d3[curveType as keyof typeof d3] as d3.CurveFactory
      if (typeof curveFunction === 'function') {
        line.curve(curveFunction)
      }
    }
    
    const axes = g.append('g')
      .attr('class', 'chart-axes')
    
    axes.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
    
    axes.append('g')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y))
    
    chartBody.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', unref(props.strokeColor) || 'steelblue')
      .attr('stroke-width', unref(props.strokeWidth) || 1.5)
      .attr('d', line)
    
    container.value.appendChild(svg.node()!)
    return [container.value]
  })

  return () => chart
})

export default component 