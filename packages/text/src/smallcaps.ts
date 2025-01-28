import { builtins, defineComponent } from '@eich/renderer'

export const component = defineComponent(() => {
  const span = document.createElement('span')
  span.style.fontVariant = 'small-caps'
  return span
})

builtins.set('smallcaps', component)
export default component
