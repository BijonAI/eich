import { createCompiler, WidgetResolver } from "@eich/compiler"
import {
  row,
  col,
  container,
  eich
} from '@eich/compiler'
import { realize } from "./realize"

export * from './realize'

export function createRenderer(resolvers: WidgetResolver[]) {
  const compiler = createCompiler([
    ...resolvers,
    eich,
    row,
    col,
    container
  ])

  function renderToHTML(eich: string) {
    const widget = compiler.compile(eich, {})
    if (!widget) return ''
    return realize(widget.widget, widget.data)
  }

  return { renderToHTML }
}

