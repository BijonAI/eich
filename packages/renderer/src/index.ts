import { baseResolvers, baseEvaluaters, createCompiler, WidgetResolver, WidgetEvaluater } from "@eich/compiler"
import { realize } from "./realize"
import { Widget } from "@eich/compiler"

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
    
  }

  async function renderToNode(eich: string) {
    return ((await compiler.compile(eich, {})) as Widget).element
  }

  return { renderToHTML, renderToNode }
}

