export interface VElement {
  tag: string
  attributes: Record<string, any>
  children: Array<VElement>
  parent?: VElement
}

export interface WidgetContext {
  data?: Record<string, any>
  global: Record<string, any>
}

export type WidgetResolver<T extends EichElement = EichElement> = (tag: {
  widget: T,
  context: WidgetContext
}) => {
  widget: VElement
  context: WidgetContext
} | null

export type WidgetPresolver<T extends EichElement = EichElement> = (tag: {
  widget: T,
  context: WidgetContext
}) => WidgetContext | null

export type EichElementBase<T extends Record<string, any>> = VElement & T

export interface FunctionalProperties {
  for?: string
  if?: string
  else?: string
  elif?: string
}

export type EichElement = EichElementBase<FunctionalProperties>

export function defineResolver<T extends EichElement>(resolver: WidgetResolver<T>): WidgetResolver<T> {
  return resolver
}

export function definePresolver<T extends EichElement>(resolver: WidgetPresolver<T>): WidgetPresolver<T> {
  return resolver
}
