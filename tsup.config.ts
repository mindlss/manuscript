import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/app.ts'],
  target: 'node16',
  format: ['cjs', 'esm'],
  clean: true,
  dts: true,
  sourcemap: true,
  external: ['some-external-dependency'],
});
