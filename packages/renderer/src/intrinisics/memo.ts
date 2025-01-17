import { computed } from '@vue/reactivity'

import {
  createAdhoc,
  defineComponent,
  getCurrentContext,
  intrinsics,
} from '../renderer'

export interface MemoAttributes {
  $value: string
  key: string
}

const component = defineComponent(
  ({ $value, key }: MemoAttributes) => {
    const adhoc = createAdhoc($value)
    const context = getCurrentContext()
    context[key] = computed(() => adhoc(context))
  },
)

intrinsics.set('memo', component)

export default component
