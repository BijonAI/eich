import {
  defineComponent,
  intrinsics,
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

intrinsics.set('scope', component)

export default component
