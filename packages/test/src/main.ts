import { render, toRoot } from "@eich/renderer"

const HTMLContent = await fetch('/test.eich').then(res => res.text())

const finalHTML = render(toRoot(HTMLContent))

console.log(finalHTML)
document.querySelector<HTMLDivElement>('#app')!.appendChild(finalHTML![0])
