import { EichBasicNode, MaybeRef } from '@eich/renderer'

export interface Margin {
  top: MaybeRef<number>
  right: MaybeRef<number>
  bottom: MaybeRef<number>
  left: MaybeRef<number>
}

export interface ChartDimensions {
  width: MaybeRef<number>
  height: MaybeRef<number>
  margin: MaybeRef<Margin>
}

export interface ChartData<T = any> {
  data: MaybeRef<T[]>
  xKey: MaybeRef<keyof T>
  yKey: MaybeRef<keyof T>
}

export type BaseChartNode<T extends string, D = any, P = {}> = 
  EichBasicNode<T, ChartDimensions & ChartData<D> & P> 