import { render, toRoot, effect, RegistryComponent } from "@eich/renderer"
import { lineChart } from "@eich/support-d3"

RegistryComponent.register('line-chart', lineChart)

const HTMLContent = await fetch('/test.eich').then(res => res.text())

const root = toRoot(HTMLContent)

const finalHTML = render(root)

effect(() => {
  const app = document.querySelector<HTMLDivElement>('#app')!
  app.innerHTML = ''
  app.append(...finalHTML.value)
})
