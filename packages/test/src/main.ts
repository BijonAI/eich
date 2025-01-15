import { render, toRoot, effect } from "@eich/renderer"

const HTMLContent = await fetch('/test.eich').then(res => res.text())

const root = toRoot(HTMLContent)

const finalHTML = render(root)


effect(() => {
  const app = document.querySelector<HTMLDivElement>('#app')!
  app.innerHTML = ''
  app.append(...finalHTML.value)
})
