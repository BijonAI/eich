import { builtins, defineComponent, effect, toValue, useAttrs } from '@eichjs/renderer'

export interface ListAttributes {
  type: 'ul' | 'ol'
}

const component = defineComponent<ListAttributes>((props, children) => {
  const { type } = useAttrs(props, ['type'])
  const list = document.createElement(toValue(type) ?? 'ul') as HTMLUListElement | HTMLOListElement
  effect(() => {
    list.type = toValue(type) ?? 'ul'
  })
  list.append(...children())
  return list
})

builtins.set('list', component)

export default component
