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
import { intrinsics } from '@eich/renderer'
import {
  Coordinate,
  Field,
  Function,
  Parametric,
  Vector,
} from '@eich/support-math'
import '@eich/renderer/intrinisics'

intrinsics.set('container', Container)
intrinsics.set('row', Row)
intrinsics.set('col', Col)

intrinsics.set('button', Button)
intrinsics.set('input', Input)
intrinsics.set('rect', Rect)
intrinsics.set('line', Line)
intrinsics.set('circle', Circle)
intrinsics.set('ellipse', Ellipse)
intrinsics.set('polygon', Polygon)
intrinsics.set('polyline', Polyline)
intrinsics.set('path', Path)

intrinsics.set('coordinate', Coordinate)
intrinsics.set('field', Field)
intrinsics.set('function', Function)
intrinsics.set('parametric', Parametric)
intrinsics.set('vector', Vector)

export * from '@eich/components'
export * from '@eich/layout'
export * from '@eich/renderer'
export * from '@eich/renderer/intrinisics'
export * from '@eich/support-math'
