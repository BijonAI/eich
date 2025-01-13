import { EichElement, WidgetEvaluater } from "../types";

export function cheat(evaluater: WidgetEvaluater, widget: EichElement, tagName: string) {
  return evaluater({
    widget: {
      ...widget,
      tag: tagName
    },
    context: {
      data: {}
    }
  })
}
