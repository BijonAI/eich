import { defineComponent, builtins } from "@eich/renderer"

const Button = defineComponent((_, children) => {
  const button = document.createElement('button')
  button.append(...children())

  return button
}, {
  fallthrough: true
})

builtins.set('button', Button)

export default Button
