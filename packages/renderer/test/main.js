import { createRenderer } from '../dist/index.js'
import fs from 'fs'
import { baseResolvers } from '@eich/compiler'

const renderer = createRenderer(baseResolvers)

fs.writeFileSync('output.html', renderer.renderToHTML(
  fs.readFileSync('./test.eich', 'utf-8')
))
