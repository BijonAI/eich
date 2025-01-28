import { builtins, defineComponent } from "@eich/renderer"

export const component = defineComponent(() => {
  const span = document.createElement('span')
  span.style.textTransform = 'uppercase'
  return span
})

builtins.set('upper', component)
export default component
