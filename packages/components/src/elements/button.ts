import {
  defineComponent,
  intrinsics,
} from '@eich/renderer'
import { createDelegate } from '@eich/renderer'

export interface ButtonAttributes {
  '@click': string
}

const component = defineComponent(
  (attrs: ButtonAttributes, children) => {
    const delegate = createDelegate(attrs)

    const button = document.createElement('button')
    button.append(...children())

    delegate(button)
    return button
  },
)

intrinsics.set('button', component)

export default component
