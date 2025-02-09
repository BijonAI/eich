import { builtins, defineComponent } from '@eichjs/renderer'

export const component = defineComponent(() => {
  return document.createElement('br')
})

builtins.set('lr', component)
export default component
