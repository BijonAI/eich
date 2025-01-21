import { eich, parse, parseRaw, renderRoots } from "@eich/renderer"

const app = document.querySelector<HTMLDivElement>('#app')!
const source = `
<value $data="x + y" />
{{ x + y }}
`

console.log(parse(source), parseRaw(source))
