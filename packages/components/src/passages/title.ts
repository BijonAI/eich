import { builtins, defineComponent, useAttrs } from '@eich/renderer'

export interface TitleAttributes {
  level: 1 | 2 | 3 | 4 | 5 | 6
}

const component = defineComponent<TitleAttributes>((props, children) => {
  const { level } = useAttrs(props, ['level'])
  const h = document.createElement(`h${level}`)
  h.append(...children())
  return h
})

builtins.set('title', component)

export default component
