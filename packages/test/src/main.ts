import { eich, parse, parseRaw, TextMode, textMode } from "@eich/renderer"
import './button'

textMode.set('line-chart', TextMode.RAWTEXT)

const source = `
<a><b><c>Hello</b>
`

console.log(parse(source))
console.log(parseRaw(source, { resolver: (tag) => ['line-chart'].includes(tag) ? TextMode.RCDATA : TextMode.DATA }))


document.body.append(...eich`
<>
  <let :count="0" memo:plus="count + 1" />
  <button @click="count++">
    This is {{ count }}&nbsp;{{ plus }}
  </button>
  <>
</>
`)