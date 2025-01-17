import { eich, intrinsics } from "@eich/renderer"
import { Container, Row, Col } from "@eich/layout"
import { Button, Input } from "@eich/components"

intrinsics.set('container', Container)
intrinsics.set('row', Row)
intrinsics.set('column', Col)
intrinsics.set('button', Button)
intrinsics.set('input', Input)

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

  <input model="name" />
  <value $data="name" />
  
  <for key="x" $in="list">
    <column>
      <for key="y" $in="list">
        <row>
          <value $data="x + y" />
        </row>
      </for>
    </column>
  </for>
</eich>
`)