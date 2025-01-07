import { col, container, createCompiler, row, eich } from '../dist/index.js'
import fs from 'fs'
const compiler = createCompiler([
  row, col, container, eich
])
const content = fs.readFileSync('./test.eich', 'utf-8')
const result = compiler.compile(content, {})
console.log(result.widget.children)