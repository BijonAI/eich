import { computed, ref, toRaw } from '@vue/reactivity'
import { NodeType } from '../parser'
import {
  createAdhoc,
  defineComponent,
  getCurrentContext,
  intrinsics,
} from '../renderer'

const ID_REGEX = /^\p{ID_Start}[$\p{ID_Continue}]*$/u

const isValidKey = (key: string) => key.length > 0 && ID_REGEX.test(key)

const component = defineComponent(
  (_attrs, _children, { raw }) => {
    const context = getCurrentContext()
    const refs = toRaw(context)

    if (raw.type != NodeType.ELEMENT) {
      throw new Error('[eich/let] Invalid element')
    }

    for (let { name: key, value } of raw.attributes) {
      const s = key.trim().split(':')

      if (s.length == 2) {
        if (refs[s[1]] != null) {
          throw new Error(`[eich/let] Key '${s[1]}' has already been declared`)
        }

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
        if (refs[s[0]] != null) {
          throw new Error(`[eich/let] Key '${s[0]}' has already been declared`)
        }
        context[s[0]] = value
      }
      else {
        throw new Error(`[eich/let] Invalid variable key: ${key} (${s.length})`)
      }
    }
  },
)

intrinsics.set('let', component)

export default component
