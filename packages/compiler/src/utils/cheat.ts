import { EichElement, WidgetEvaluater } from "../types";

export function cheat<T extends WidgetEvaluater<any, Record<string, any>>>(evaluater: T, widget: EichElement, tagName: string) {
  return evaluater({
    widget: {
      ...widget,
      tag: tagName
    },
    context: {
      data: {},
    }
  })
}
