import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/intrinisics/*.ts'],
  format: 'esm',
  tsconfig: './tsconfig.json',
  globalName: 'eich',
  splitting: true,
  clean: true,
  dts: true,
})
