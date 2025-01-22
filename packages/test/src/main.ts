import { parseRaw, querySelectorAll } from '@eich/renderer'
import '@eich/renderer/intrinisics'

import source from './source.eich?raw'
import './button'

// render(source, document.getElementById('app')!)
const root = parseRaw(source)
console.log(querySelectorAll(root, ':root'))
console.log(root)
