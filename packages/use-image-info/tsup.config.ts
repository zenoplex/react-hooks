import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/worker.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: true,
  dts: true,
  format: ['cjs', 'esm'],
  external: ['react'],
});
