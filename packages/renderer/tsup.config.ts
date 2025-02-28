import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/builtins/*.ts', 'src/middlewares/*.ts'],
  format: 'esm',
  tsconfig: './tsconfig.json',
  target: ['es6'],
  sourcemap: true,
  clean: true,
  dts: true,
  minify: true,
})
