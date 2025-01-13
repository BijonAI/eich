import { basePresolvers, baseResolvers, createCompiler, WidgetPresolver, WidgetResolver } from "@eich/compiler"
import { realize } from "./realize"

export * from './realize'

export function createRenderer(resolvers: WidgetResolver<any>[] = [], presolvers: WidgetPresolver[] = []) {
  
  const compiler = createCompiler([
    ...baseResolvers,
    ...resolvers
  ], [
    ...basePresolvers,
    ...presolvers
  ])

  async function renderToHTML(eich: string) {
    
    const widget = await compiler.compile(eich, {})
    if (!widget) return ''
    
    return realize(widget.widget)
  }

  return { renderToHTML }
}

