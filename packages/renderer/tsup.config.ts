import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/builtins/*.ts', 'src/middlewares/*.ts'],
  format: 'esm',
  tsconfig: './tsconfig.json',
  globalName: 'Eich',
  clean: true,
  dts: true,
})
