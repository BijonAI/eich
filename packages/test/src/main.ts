import { render, effect, eich, intrinsics } from "@eich/renderer"
import { Container } from "@eich/layout"

intrinsics.set('container', Container)
const HTMLContent = await fetch('/test.eich').then(res => res.text())

const app = document.querySelector<HTMLDivElement>('#app')!
app.append(...eich`
<eich>
  <var key="list" $value="[1,2,3]" />
  <for key="item" $in="list">
    <value $data="item" />
  </for>
  <container>
    <button @click="list.push(list.length + 1)">Add</button>
    <button @click="list.pop()">Remove</button>
    <button @click="list = 'Love you!'">Love</button>
    <button @click="list = [1,2,3]">un-love</button>
  </container>
</eich>
`)