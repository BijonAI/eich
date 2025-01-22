import { computed, ref } from '@vue/reactivity'
import {
  createAdhoc,
  defineComponent,
  getCurrentContext,
  intrinsics,
} from '../renderer'

const ID_REGEX = /^\p{ID_Start}[$\p{ID_Continue}]*$/u

const isValidKey = (key: string) => key.length > 0 && ID_REGEX.test(key)

const component = defineComponent(
  (attrs: Record<string, string>) => {
    const context = getCurrentContext()
    // context[key] = createAdhoc($value)(context)
    for (const key in attrs) {
      const s = key.trim().split(':')

      if (s.length == 2) {
        if (s[0] == 'memo') {
          const adhoc = createAdhoc(attrs[key], context)
          context[s[1]] = computed(() => adhoc())
        }
        else if (s[0] == '' || s[0] == 'ref') {
          context[s[1]] = ref(createAdhoc(attrs[key], context)())
        }
        else {
          throw new Error(`[eich/let] Invalid variable key: ${key}`)
        }
      }
      else if (s.length == 1 && isValidKey(s[0])) {
        context[key] = attrs[key]
      }
      else {
        throw new Error(`[eich/let] Invalid variable key: ${key} (${s.length})`)
      }
    }
  },
)

intrinsics.set('let', component)

export default component
