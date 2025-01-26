import { parseRaw, querySelectorAll, render } from '@eich/renderer'

import '@eich/renderer/middlewares/fallthrough'
import '@eich/renderer/builtins'

import './button'

import source from './source.eich?raw'

console.log(parseRaw(source))

render(source, document.getElementById('app')!)
