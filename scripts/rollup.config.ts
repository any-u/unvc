import { defineConfig, InputPluginOption } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'

const input = 'src/index.ts'

const plugins: InputPluginOption = [
  esbuild(),
  nodeResolve(),
  commonjs(),
]

export default defineConfig([{
  input,
  output: {
    file: `dist/index.js`,
    format: 'es'
  },
  plugins,
}, {
  input,
  output: {
    file: 'dist/index.d.ts',
    format: 'es'
  },
  plugins: [
    ...plugins,
    dts()
  ]
}])