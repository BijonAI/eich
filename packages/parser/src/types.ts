import { ExpressionLike } from "@eich/script"

export type WidgetResolver<T extends EichElement = EichElement> = (tag: {
  widget: T,
  data: Record<string, any>
}) => {
  widget: HTMLElement
  data: Record<string, any>
}

export type EichElementBase<T extends Record<string, any>> = Element & T

export interface FunctionalProperties {
  for?: ExpressionLike
  if?: ExpressionLike
  else?: ExpressionLike
  elif?: ExpressionLike
}

export type EichElement = EichElementBase<FunctionalProperties>

export function defineResolver<T extends EichElement>(resolver: WidgetResolver<T>): WidgetResolver<T> {
  return resolver
}
