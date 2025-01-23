import { defineComponent, builtins, createDelegate } from "@eich/renderer"

const Button = defineComponent((attrs, children) => {
  const button = document.createElement('button')
  const delegate = createDelegate(attrs)
  button.append(...children())
  delegate(button)
  return button
})

builtins.set('button', Button)

export default Button
