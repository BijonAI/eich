import { createRenderer } from "@eich/renderer"

const renderer = createRenderer()

const HTMLContent = await fetch('/test.eich').then(res => res.text())

const finalHTML = await renderer.renderToHTML(HTMLContent)


document.querySelector<HTMLDivElement>('#app')!.innerHTML = finalHTML
