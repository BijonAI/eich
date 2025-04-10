import { effect } from '@vue/reactivity'
import {
  builtins,
  createAdhoc,
  defineComponent,
  getCurrentContext,
} from '../renderer'

export interface ValueAttributes {
  $data: string
}

const component = defineComponent(
  ({ $data }: ValueAttributes) => {
    const context = getCurrentContext()
    const adhoc = createAdhoc($data)
    const node = document.createTextNode('')
    effect(() => {
      const data = adhoc(context)
      const text = data?.toString() ?? Object.prototype.toString.call(data)
      node.nodeValue = text
    })

    return node
  },
)

builtins.set('value', component)

export default component
