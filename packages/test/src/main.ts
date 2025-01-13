import { createRenderer } from "@eich/renderer"

const renderer = createRenderer()

const HTMLContent = await fetch('/test.eich').then(res => res.text())

const finalHTML = await renderer.renderToNode(HTMLContent)

document.querySelector<HTMLDivElement>('#app')!.appendChild(finalHTML!)
