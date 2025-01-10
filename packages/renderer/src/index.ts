import { createCompiler, WidgetPresolver, WidgetResolver } from "@eich/compiler"
import {
  row,
  col,
  container,
  eich
} from '@eich/compiler'
import { realize } from "./realize"

export * from './realize'

export function createRenderer(resolvers: WidgetResolver[], presolvers: WidgetPresolver[]) {
  const compiler = createCompiler(resolvers, presolvers)

  async function renderToHTML(eich: string) {
    const widget = await compiler.compile(eich, {})
    if (!widget) return ''
    return realize(widget.widget)
  }

  return { renderToHTML }
}

