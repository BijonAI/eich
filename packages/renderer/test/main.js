import { createRenderer } from '../dist/index.js'
import fs from 'fs'
import { eich, row, col, container } from '@eich/compiler'

const renderer = createRenderer([
  row,
  col,
  container,
  eich
])

console.log(renderer.renderToHTML(fs.readFileSync('./test.eich', 'utf-8')))
