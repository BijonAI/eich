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
  Span,
  Table,
} from '@eich/components'
import {
  Align,
  Block,
  Column,
  Flexbox,
  PageBreak,
  Pages,
  Row,
  Transform,
} from '@eich/layout'
import { Link, Par } from '@eich/model'
import { builtins } from '@eich/renderer'
import {
  // TODO
  LineSegment,
  MathField,
  Plane,
  Vector,
} from '@eich/support-math'
import {
  Highlight,
  Lower,
  Lr,
  Overline,
  Smallcaps,
  Strike,
  Sub,
  Super,
  Text,
  Underline,
  Upper,
} from '@eich/text'
import '@eich/renderer/builtins'

builtins.set('align', Align)
builtins.set('block', Block)
builtins.set('transform', Transform)
builtins.set('pages', Pages)
builtins.set('page-break', PageBreak)
builtins.set('flexbox', Flexbox)
builtins.set('row', Row)
builtins.set('column', Column)

builtins.set('button', Button)
builtins.set('input', Input)
builtins.set('span', Span)
builtins.set('rect', Rect)
builtins.set('line', Line)
builtins.set('circle', Circle)
builtins.set('ellipse', Ellipse)
builtins.set('polygon', Polygon)
builtins.set('polyline', Polyline)
builtins.set('path', Path)
builtins.set('table', Table)

builtins.set('math-field', MathField)
builtins.set('line-segment', LineSegment)
builtins.set('vector', Vector)
builtins.set('plane', Plane)

builtins.set('highlight', Highlight)
builtins.set('lower', Lower)
builtins.set('lr', Lr)
builtins.set('overline', Overline)
builtins.set('smallcaps', Smallcaps)
builtins.set('strike', Strike)
builtins.set('sub', Sub)
builtins.set('super', Super)
builtins.set('underline', Underline)
builtins.set('upper', Upper)
builtins.set('text', Text)

builtins.set('link', Link)
builtins.set('par', Par)

export * from '@eich/components'
export * from '@eich/layout'
export * from '@eich/model'
export * from '@eich/renderer'
export * from '@eich/renderer/builtins'
export * from '@eich/support-math'
export * from '@eich/text'
