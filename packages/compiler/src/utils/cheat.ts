import { EichElement, WidgetResolver } from "../types";

export function cheat(resolver: WidgetResolver, widget: EichElement, tagName: string) {
  return resolver({
    widget: {
      ...widget,
      tag: tagName
    },
    context: {
      data: {},
      global: {}
    }
  })
}
