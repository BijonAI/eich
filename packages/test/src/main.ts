import { eich, parse, parseRaw, TextMode, textMode } from "@eich/renderer"
import './button'

textMode.set('line-chart', TextMode.RAWTEXT)

const source = `<line-chart>aa</line-chart>
<></>`

console.log(parse(source))
console.log(parseRaw(source, { resolver: (tag) => ['line-chart'].includes(tag) ? TextMode.RCDATA : TextMode.DATA }))


document.body.append(...eich`
<>
  <var key="count" $value="0" />
  <button @click="count++">{{ count }}</button>
</>
`)