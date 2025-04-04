import animation from '@eichjs/animation'
import {
  Button,
  Input,
  List,
  ListItem,
  Span,
  Title,
} from '@eichjs/components'
import {
  Align,
  Block,
  Column,
  Flexbox,
  Grid,
  Row,
  Transform,
} from '@eichjs/layout'
import { Link, Par } from '@eichjs/model'
import { builtins, middlewares } from '@eichjs/renderer'
import '@eichjs/renderer/builtins'
import '@eichjs/renderer/builtins/script'
import '@eichjs/renderer/builtins/style'
import '@eichjs/renderer/middlewares/fallthrough'
import '@eichjs/renderer/middlewares/ref'
import {
  // TODO: math-field
  Arc,
  Dot,
  LineSegment,
  MathField,
  Parametric,
  Plane,
  Poly,
  Vector,
} from '@eichjs/support-math'
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
} from '@eichjs/text'

builtins.set('align', Align)
builtins.set('block', Block)
builtins.set('transform', Transform)
builtins.set('flexbox', Flexbox)
builtins.set('row', Row)
builtins.set('column', Column)
builtins.set('grid', Grid)

builtins.set('button', Button)
builtins.set('input', Input)
builtins.set('span', Span)
builtins.set('list', List)
builtins.set('list-item', ListItem)
builtins.set('title', Title)
builtins.set('par', Par)

// TODO: math-field
builtins.set('arc', Arc)
builtins.set('dot', Dot)
builtins.set('math-field', MathField)
builtins.set('line-segment', LineSegment)
builtins.set('vector', Vector)
builtins.set('plane', Plane)
builtins.set('parametric', Parametric)
builtins.set('polygon-segment', Poly)

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

middlewares.post.set('animation', animation)

export * from '@eichjs/components'
export * from '@eichjs/layout'
export * from '@eichjs/model'
export * from '@eichjs/renderer'
export * from '@eichjs/renderer/builtins'
export * from '@eichjs/support-math'
export * from '@eichjs/text'

