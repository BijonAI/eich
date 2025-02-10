import { computed, reactive, readonly, ref, shallowReactive, shallowReadonly, shallowRef, toRaw, toRef, toRefs, unref, watch } from '@vue/reactivity'
import { NodeType, TextMode } from '../parser'
import { builtins, createAdhoc, defineComponent, getCurrentContext } from '../renderer'
import { textMode } from '../resolver'
import isPlainObject from '../utils'

textMode.set('script', TextMode.RAWTEXT)

const defaultUtils = Object.freeze({ ref, reactive, readonly, shallowReadonly, watch, shallowReactive, shallowRef, toRaw, toRefs, toRef, computed, unref })

export const component = defineComponent(
  (_0, _1, { raw: node }) => {
    if (node.type != NodeType.ELEMENT) {
      return
    }

    if (node.children.length != 1 || node.children[0].type != NodeType.TEXT) {
      return
    }

    const id = Math.round(performance.now() * 1000)
    const scriptSource = `function(__$utils_${id}){with(__$utils_${id}){${node.children[0].raw}}}`
    const context = getCurrentContext()

    const fn = createAdhoc(scriptSource, context)() as any
    const out = fn(defaultUtils)
    if (isPlainObject(out)) {
      Object.assign(context, out)
    }
  },
)

builtins.set('script', component)
