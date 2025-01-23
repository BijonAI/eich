import { parseRaw, querySelectorAll, render } from '@eich/renderer'
import '@eich/renderer/intrinsics'
import 'eichjs'
import source from './source.eich?raw'

render(source, document.getElementById('app')!)
