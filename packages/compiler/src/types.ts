import { ComputedRef, WatchSource } from "@vue/reactivity"

export interface VElement {
  tag: string
  attributes: Record<string, any>
  children: Array<VElement>
  parent?: VElement
}

export interface Widget {
  element?: Element
  injections?: Record<string, any>
}

export interface WidgetContext<T extends EichElement> {
  data?: Record<string, any>
  resolveChildren?: (children: T['children'], context: WidgetContext<T>) => Promise<Array<Element>>
  set?: (key: string, value: any, dataContext?: Record<string, any>) => Promise<void>
  get?: (key: string) => any,
}

export function defineWidget(widget: Widget): Widget {
  return widget
}

export type MaybePromise<T> = T | Promise<T>

export type WidgetEvaluater<T extends EichElement = EichElement> = (tag: {
  widget: T,
  context: WidgetContext<T>
}) => MaybePromise<Widget>

export type WidgetResolver<T extends EichElement = EichElement> = (tag: {
  widget: T,
  context: WidgetContext<T>
}) => MaybePromise<WidgetContext<T> | null>

export type EichElementBase<T extends Record<string, any>> = VElement & T

export type EichElement = EichElementBase<Record<string, any>>

export function defineEvaluater<T extends EichElement>(evaluater: WidgetEvaluater<T>): WidgetEvaluater<T> {
  return evaluater
}

export function defineResolver<T extends EichElement>(evaluater: WidgetResolver<T>): WidgetResolver<T> {
  return evaluater
}

declare global {
  interface Window {
    EICH_ENV: Record<string, any>
  }
}