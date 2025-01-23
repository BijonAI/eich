import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts', 'src/intrinsics/*.ts'],
  format: 'esm',
  tsconfig: './tsconfig.json',
  globalName: 'eich',
  splitting: true,
  clean: true,
  dts: true,
})
