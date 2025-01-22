import { computed, ref } from '@vue/reactivity'
import {
  createAdhoc,
  defineComponent,
  getCurrentContext,
  intrinsics,
} from '../renderer'
import { NodeType } from '../parser'

const ID_REGEX = /^\p{ID_Start}[$\p{ID_Continue}]*$/u

const isValidKey = (key: string) => key.length > 0 && ID_REGEX.test(key)

const component = defineComponent(
  (_attrs, _children, { raw }) => {
    const context = getCurrentContext()

    if (raw.type != NodeType.ELEMENT) {
      throw new Error('[eich/let] Invalid element')
    }

    for (let { name: key, value } of raw.attributes) {
      const s = key.trim().split(':')

      if (s.length == 2) {
        value = value.trim()
        if (s[0] == 'memo') {
          const adhoc = createAdhoc(value, context)
          if (value.length == 0) {
            throw new Error(`[eich/let] Invalid variable key/value: ${key}=${value}`)
          }
          context[s[1]] = computed(() => adhoc())
        }
        else if (s[0] == '' || s[0] == 'ref') {
          context[s[1]] = ref(value.length != 0 ? createAdhoc(value, context)() : null)
        }
        else {
          throw new Error(`[eich/let] Invalid variable key: ${key}`)
        }
      }
      else if (s.length == 1 && isValidKey(s[0])) {
        context[key] = value
      }
      else {
        throw new Error(`[eich/let] Invalid variable key: ${key} (${s.length})`)
      }
    }
  },
)

intrinsics.set('let', component)

export default component
