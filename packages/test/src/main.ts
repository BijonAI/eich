import { render, toRoot, effect } from "@eich/renderer"

const HTMLContent = await fetch('/test.eich').then(res => res.text())

const root = toRoot(HTMLContent)

const finalHTML = render(root)

console.log(finalHTML)

effect(() => {
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = finalHTML.value
})