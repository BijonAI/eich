import { parseSource, render } from '@eichjs/renderer'

import '@eichjs/renderer/middlewares/fallthrough'
import '@eichjs/renderer/middlewares/ref'
import '@eichjs/renderer/builtins'
import '@eichjs/renderer/builtins/script'
import '@eichjs/renderer/builtins/style'
import 'eichjs'

// import './button'

import source from './source.eich?raw'

console.log(parseSource(source))

render(source, document.getElementById('app')!)
