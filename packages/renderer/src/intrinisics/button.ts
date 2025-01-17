import {
  defineComponent,
  intrinsics,
} from '../renderer'
import { createDelegate } from '../utils'

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
