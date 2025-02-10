import {
  builtins,
  createAdhoc,
  defineComponent,
  getCurrentContext,
} from '../renderer'

export interface VarAttributes {
  $value: string
  key: string
}

const component = defineComponent(
  ({ $value, key }: VarAttributes) => {
    const context = getCurrentContext()
    context[key] = createAdhoc($value)(context)
  },
)

builtins.set('var', component)

export default component
