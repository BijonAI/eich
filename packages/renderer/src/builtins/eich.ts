import { useAttrs } from "../adhoc"
import { builtins, defineComponent } from "../renderer"

export interface EichAttributes {
  $width: number
  $height: number
}

const component = defineComponent<EichAttributes>((props, children) => {
  const { width, height } = useAttrs(props, ['width', 'height'])
  const root = document.createElement('div')
  root.style.display = 'flex'
  root.style.width = width?.toString() ?? '100%'
  root.style.height = height?.toString() ?? '100%'
  root.append(...children())
  return root
})

builtins.set('eich', component)
export default component
