import { parseRaw, querySelectorAll, StreamParser } from '@eich/renderer'
import '@eich/renderer/intrinisics'

import source from './source.eich?raw'
import './button'

console.log(new StreamParser())



// render(source, document.getElementById('app')!)
const root = parseRaw(source)
console.log(querySelectorAll(root, ':root'))
console.log(root)
