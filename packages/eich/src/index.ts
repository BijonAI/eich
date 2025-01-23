import {
  Button,
  Circle,
  Ellipse,
  Input,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
} from '@eich/components'
import {
  Col,
  Container,
  Row,
} from '@eich/layout'
import { builtins } from '@eich/renderer'
import {
  Coordinate,
  Field,
  Function,
  Parametric,
  Vector,
} from '@eich/support-math'
import '@eich/renderer/builtins'

builtins.set('container', Container)
builtins.set('row', Row)
builtins.set('col', Col)

builtins.set('button', Button)
builtins.set('input', Input)
builtins.set('rect', Rect)
builtins.set('line', Line)
builtins.set('circle', Circle)
builtins.set('ellipse', Ellipse)
builtins.set('polygon', Polygon)
builtins.set('polyline', Polyline)
builtins.set('path', Path)

builtins.set('coordinate', Coordinate)
builtins.set('field', Field)
builtins.set('function', Function)
builtins.set('parametric', Parametric)
builtins.set('vector', Vector)

export * from '@eich/components'
export * from '@eich/layout'
export * from '@eich/renderer'
export * from '@eich/renderer/builtins'
export * from '@eich/support-math'
