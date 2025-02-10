import { NodeType, TextMode } from '../parser'
import { builtins, defineComponent } from '../renderer'
import { textMode } from '../resolver'

const kNodeMap = new Map<string, HTMLStyleElement>()

export const component = defineComponent(
  (_0, _1, { raw: node }) => {
    if (node.type != NodeType.ELEMENT) {
      return
    }

    if (node.children.length != 1 || node.children[0].type != NodeType.TEXT) {
      return
    }

    const source = node.children[0].raw.trim()
    if (source.length == 0 || kNodeMap.has(source)) {
      return
    }

    const el = document.createElement('style')
    el.textContent = node.children[0].raw
    document.head.appendChild(el)
    kNodeMap.set(source, el)
  },
)

textMode.set('style', TextMode.RAWTEXT)
builtins.set('style', component)
