import { parse, parseRaw } from "@eich/renderer"

const source = `
<value $data="x + y" />
{{ x + y }}
`

console.log(parse(source))
console.log(parseRaw(source))
