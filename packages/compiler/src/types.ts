export interface VElement {
  tag: string
  attributes: Record<string, any>
  children: Array<VElement>
  parent?: VElement
}

export interface WidgetContext {
  data?: Record<string, any>
  resolvers?: Array<WidgetResolver>
  resolveChildren?: (children: Array<VElement>, context: WidgetContext) => Promise<Array<VElement>>
  set?: (key: string, value: any, dataContext?: Record<string, any>) => Promise<void>
  get?: (key: string) => any
}

export type MaybePromise<T> = T | Promise<T>

export type WidgetResolver<T extends EichElement = EichElement> = (tag: {
  widget: T,
  context: WidgetContext
}) => MaybePromise<{
  widget: VElement
  context: WidgetContext
} | null>

export type WidgetPresolver<T extends EichElement = EichElement> = (tag: {
  widget: T,
  context: WidgetContext
}) => MaybePromise<WidgetContext | null>

export type EichElementBase<T extends Record<string, any>> = VElement & T

export type EichElement = EichElementBase<Record<string, any>>

export function defineResolver<T extends EichElement>(resolver: WidgetResolver<T>): WidgetResolver<T> {
  return resolver
}

export function definePresolver<T extends EichElement>(resolver: WidgetPresolver<T>): WidgetPresolver<T> {
  return resolver
}

declare global {
  interface Window {
    EICH_ENV: Record<string, any>
  }
}