import { computed, reactive, ref, toRaw, toRefs } from '@vue/reactivity'
import { NodeType } from '../parser'
import {
  builtins,
  createAdhoc,
  defineComponent,
  getCurrentContext,
  setCurrentContext,
} from '../renderer'

const ID_REGEX = /^\p{ID_Start}[$\p{ID_Continue}]*$/u

const isValidKey = (key: string) => key.length > 0 && ID_REGEX.test(key)

const component = defineComponent(
  (attrs, _children, { raw }) => {
    const context = getCurrentContext()
    const refs = (attrs['#assign'] ? toRaw : toRefs as any)(context)

    if (raw.type != NodeType.ELEMENT) {
      throw new Error('[eich/let] Invalid element')
    }

    for (let { name: key, value } of raw.attributes) {
      const s = key.trim().split(':')

      if (s.length == 2) {
        if (attrs['#strict'] != null && refs[s[1]] != null) {
          throw new Error(`[eich/let] Key '${s[1]}' has already been declared`)
        }

        value = value.trim()
        if (s[0] == 'memo') {
          const adhoc = createAdhoc(value, context)
          if (value.length == 0) {
            throw new Error(`[eich/let] Invalid variable key/value: ${key}=${value}`)
          }

          if (attrs['#assign'] == null) {
            refs[s[1]] = computed(() => adhoc())
          }
          else {
            context[s[1]] = computed(() => adhoc())
          }
        }
        else if (s[0] == '' || s[0] == 'ref') {
          const initial = value.length != 0 ? createAdhoc(value, context)() : null
          if (attrs['#assign'] == null) {
            refs[s[1]] = ref(initial)
          }
          else {
            context[s[1]] = ref(initial)
          }
        }
        else {
          throw new Error(`[eich/let] Invalid variable key: ${key}`)
        }
      }
      else if (s.length == 1 && isValidKey(s[0])) {
        if (attrs['#assign'] == null) {
          refs[s[0]] = value
        }
        else {
          context[s[0]] = value
        }
      }
      else {
        continue
      }
    }

    if (attrs['#assign'] == null) {
      setCurrentContext(reactive(refs))
    }
  },
)

builtins.set('let', component)

export default component
