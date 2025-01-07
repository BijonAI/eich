import { WidgetResolver, EichElement } from "./types";

export function createParser(resolvers: Array<WidgetResolver>) {
  const additionalResolvers: Array<WidgetResolver> = []
  const parser = new DOMParser()

  function addResolver(resolver: WidgetResolver) {
    additionalResolvers.push(resolver)
  }

  function parse(eich: EichElement | string, data: Record<string, any>) {
    let tree: EichElement
    if (typeof eich === "string")
      tree = parser.parseFromString(eich, "application/xml").documentElement
    else
      tree = eich

    for (const resolver of [...resolvers, ...additionalResolvers]) {
      const widget = resolver({
        widget: tree,
        data,
      })
      if (widget) {
        tree.children || widget.widget.append(
          ...[...tree.children].map(child => parse(child, widget.data)?.widget) as Array<HTMLElement>
        )
        return widget
      }
    }
    return null
  }

  return {
    parse,
    addResolver,
  }
}
