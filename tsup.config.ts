import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  tsconfig: '../../tsconfig.json',
  globalName: 'Eich',
  clean: true,
  dts: true,
})
