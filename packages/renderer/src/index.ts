import { baseResolvers, baseEvaluaters, createCompiler, WidgetResolver, WidgetEvaluater } from "@eich/compiler"
import { realize } from "./realize"

export * from './realize'

export function createRenderer(evaluaters: WidgetEvaluater<any>[] = [], resolvers: WidgetResolver[] = []) {
  
  const compiler = createCompiler([
    ...baseEvaluaters,
    ...evaluaters
  ], [
    ...baseResolvers,
    ...resolvers
  ])

  async function renderToHTML(eich: string) {
    
    const widget = await compiler.compile(eich, {})
    if (!widget) return ''
    
    return realize(widget.widget)
  }

  return { renderToHTML }
}

