import { builtins, useAttrs } from "@eich/renderer"

import { defineComponent } from "@eich/renderer"

const component = defineComponent((attrs, children) => {
  const slot = document.createElement('slot')
  slot.name = 'page-break'
  return slot
})

builtins.set('page-break', component)

export default component
