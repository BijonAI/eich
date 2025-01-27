import { parseSource, render } from '@eich/renderer'

import '@eich/renderer/middlewares/fallthrough'
import '@eich/renderer/middlewares/ref'
import '@eich/renderer/builtins'
import '@eich/renderer/builtins/script'
import '@eich/renderer/builtins/style'

import './button'

import source from './source.eich?raw'

console.log(parseSource(source))

render(source, document.getElementById('app')!)
