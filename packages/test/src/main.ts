import { parseRaw, querySelectorAll, render } from "@eich/renderer"
import './button'
import source from './source.eich?raw'

// render(source, document.getElementById('app')!)
const root = parseRaw(source)
console.log(querySelectorAll(root, ':root'))
console.log(root)
