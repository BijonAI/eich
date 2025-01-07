import { ExpressionLike } from "@eich/script"

export interface VElement {
  tag: string
  attributes: Record<string, any>
  children: Array<VElement>
}

export type WidgetResolver<T extends EichElement = EichElement> = (tag: {
  widget: T,
  data: Record<string, any>
}) => {
  widget: VElement
  data: Record<string, any>
} | null

export type EichElementBase<T extends Record<string, any>> = VElement & T

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
