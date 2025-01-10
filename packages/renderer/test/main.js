import { createRenderer } from '../dist/index.js'
import fs from 'fs'
import { baseResolvers, basePresolvers } from '@eich/compiler'

const renderer = createRenderer(baseResolvers, basePresolvers)

fs.writeFileSync('output.html', await renderer.renderToHTML(
  fs.readFileSync('./test.eich', 'utf-8')
))
console.log('[Eich Renderer] Rendered to output.html.')
