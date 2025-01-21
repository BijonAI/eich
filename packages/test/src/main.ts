import { parse, parseRaw, TextMode, textMode, modeResolver } from "@eich/renderer"

textMode.set('line-chart', TextMode.RAWTEXT)

const source = `
<line-chart><line-chart-a>aa</line-chart-a></line-chart>
<![CDATA[AAA]]>
`

console.log(parse(source))
console.log(parseRaw(source, { resolver: modeResolver }))
