export interface VElement<T extends string = string, A extends Record<string, any> = Record<string, any>> {
  tag: T
  attributes: A
  children: Array<VElement<T, A>>
  parent?: VElement<T, A>
  compiled: boolean
}

export interface Widget {
  element?: Element | Text
  injections?: Record<string, any>
  children?: Array<Widget>
}

export interface WidgetContext<T extends EichElement> {
  data?: Record<string, any>
  resolveChildren?: (children: T['children'], context: WidgetContext<T>, widget: Widget) => Promise<Array<Widget>>
  set?: (key: string, value: any, dataContext?: Record<string, any>) => Promise<void>
  get?: (key: string) => any,
}

export function defineWidget(widget: Widget & Record<string, any>): Widget & Record<string, any> {
  return widget
}

export type MaybePromise<T> = T | Promise<T>
export type MaybeArray<T> = T | T[]

export type WidgetEvaluater<T extends string = string, A extends Record<string, any> = Record<string, any>> = (tag: {
  widget: EichElementBase<T, A>
  context: WidgetContext<EichElementBase<T, A>>
}) => MaybePromise<MaybeArray<Widget> | null>

export type WidgetResolver<T extends string = string, A extends Record<string, any> = Record<string, any>> = (tag: {
  widget: EichElementBase<T, A>
  context: WidgetContext<EichElementBase<T, A>>
}) => MaybePromise<WidgetContext<EichElementBase<T, A>> | null>

export type EichElementBase<T extends string = string, A extends Record<string, any> = Record<string, any>> = VElement<T, A>

export type EichElement = EichElementBase<string, Record<string, any>>

export function defineEvaluater<T extends string = string, A extends Record<string, any> = Record<string, any>>(evaluater: WidgetEvaluater<T, A>): WidgetEvaluater<T, A> {
  return evaluater
}

export function defineResolver<T extends string = string, A extends Record<string, any> = Record<string, any>>(evaluater: WidgetResolver<T, A>): WidgetResolver<T, A> {
  return evaluater
}

declare global {
  interface Window {
    EICH_ENV: Record<string, any>
    EICH_ROOT: Widget
  }
}