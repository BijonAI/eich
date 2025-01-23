import { intrinsics } from '@eich/renderer'
import {
  Container,
  Row,
  Col,
} from '@eich/layout'
import {
  Button,
  Input,
  Rect,
  Line,
  Circle,
  Ellipse,
  Polygon,
  Polyline,
  Path,
} from '@eich/components'
import {
  lineChart,
  LineChartTitle,
  LineChartXLabel,
  LineChartYLabel,
} from '@eich/support-d3'
import { Field, Coordinate, Function, Vector, Parametric } from '@eich/support-math'

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

intrinsics.set('line-chart', lineChart)
intrinsics.set('line-chart-title', LineChartTitle)
intrinsics.set('line-chart-x-label', LineChartXLabel)
intrinsics.set('line-chart-y-label', LineChartYLabel)

intrinsics.set('field', Field)
intrinsics.set('coordinate', Coordinate)
intrinsics.set('function', Function)
intrinsics.set('vector', Vector)
intrinsics.set('parametric', Parametric)

export * from '@eich/renderer'
export * from '@eich/support-d3'
export * from '@eich/layout'
export * from '@eich/components'
export * from '@eich/support-math'
