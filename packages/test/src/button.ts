import { defineComponent, intrinsics, createDelegate } from "@eich/renderer"

const Button = defineComponent((attrs, children) => {
  const button = document.createElement('button')
  const delegate = createDelegate(attrs)
  button.append(...children())
  delegate(button)
  return button
})

intrinsics.set('button', Button)

export default Button
