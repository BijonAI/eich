import {
  createAdhoc,
  defineComponent,
  getCurrentContext,
  intrinsics,
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

intrinsics.set('var', component)

export default component
