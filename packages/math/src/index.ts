export { default as LineSegment } from './line'
export { default as MathField } from './math-field'
export { default as Plane } from './plane'
export * from './utils'
export { default as Vector } from './vector'

/*
  TODO
  搞懂了! 例如 LineSegment,
  应该就是 LineSegment from './line',
  然后注意 packages/eich/src/index.ts 内的 import { LineSegment } from '@eich/support-math' 和 builtins.set('line-segment', LineSegment)
  接着注意 packages/test/src/main.ts 内的 parseSource(source)
  最后用 packages/test/src/source.eich 内的 <line-segment $from="[0, 0]" $to="[100, 100]"/> 测试
*/