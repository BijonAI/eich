import { builtins, defineComponent } from '@eichjs/renderer'

export const component = defineComponent(() => {
  const span = document.createElement('span')
  span.style.textTransform = 'lowercase'
  return span
})

builtins.set('lower', component)
export default component
