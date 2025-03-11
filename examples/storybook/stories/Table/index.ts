import type { TableAttributes } from '@eichjs/components'
import { Table, Td, Tr, Caption } from '@eichjs/components'
import { builtins, parse, renderRoots } from '@eichjs/renderer'

export function createTable({
  $border: border,
  '$border-width': borderWidth,
  '$border-style': borderStyle,
  '$border-color': borderColor,
  '$border-collapse': borderCollapse,
  '$border-spacing': borderSpacing,
  '$border-radius': borderRadius,
  $width: width,
  $height: height,
  '$caption-side': captionSide,
  '$empty-cells': emptyCells,
  '$table-layout': tableLayout,
  '$vertical-align': verticalAlign,
  '$text-align': textAlign,
  '$background-color': backgroundColor,
  $color: color,
  $padding: padding,
  '$box-shadow': boxShadow,
}: TableAttributes) {
  builtins.set('table', Table)
  builtins.set('tr', Tr)
  builtins.set('td', Td)
  builtins.set('caption', Caption)

  const container = document.createElement('div')

  const [nodes] = renderRoots(
    parse(
      `<table
  $border="'${border}'"
  $width="'${width}'"
  $height="'${height}'"
  $border-width="'${borderWidth}'"
  $text-align="'${textAlign}'"
  $border-style="'${borderStyle}'"
  $border-color="'${borderColor}'"
  $background-color="'${backgroundColor}'"
  $color="'${color}'"
  $padding="'${padding}'"
  $box-shadow="'${boxShadow}'"
  $border-collapse="'${borderCollapse}'"
  $border-spacing="'${borderSpacing}'"
  $border-radius="'${borderRadius}'"
  $caption-side="'${captionSide}'"
  $empty-cells="'${emptyCells}'"
  $table-layout="'${tableLayout}'"
  $vertical-align="'${verticalAlign}'"
>
  <caption>
    Caption ABOVE the table
  </caption>
  <thead>
    <tr>
      <th scope="col">Person</th>
      <th scope="col">Most interest in</th>
      <th scope="col">Age</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Chris</th>
      <td>HTML tables</td>
      <td>22</td>
    </tr>
    <tr>
      <th scope="row">Dennis</th>
      <td>Web accessibility</td>
      <td>45</td>
    </tr>
    <tr>
      <th scope="row">Sarah</th>
      <td>JavaScript frameworks</td>
      <td>29</td>
    </tr>
    <tr>
      <th scope="row">Karen</th>
      <td>Web performance</td>
      <td>36</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th scope="row" colspan="2">Average age</th>
      <td>33</td>
    </tr>
  </tfoot>
</table>
`,
    ),
    container,
  )
  return nodes[0] as HTMLTableElement
}
