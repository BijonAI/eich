import { builtins, defineComponent } from '@eich/renderer'

export const component = defineComponent(() => {
  return document.createElement('br')
})

builtins.set('lr', component)
export default component
