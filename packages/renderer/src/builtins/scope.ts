import {
  builtins,
  defineComponent,
} from '../renderer'
import { useBlockScope } from '../utils'

export interface ScopeAttributes {
  detached?: boolean
}

const component = defineComponent(
  ({ detached = false }: ScopeAttributes, children) => {
    return useBlockScope(children, detached)
  },
)

builtins.set('scope', component)

export default component
