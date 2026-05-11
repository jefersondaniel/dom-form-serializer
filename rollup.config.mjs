import { readFileSync } from 'node:fs'
import { babel } from '@rollup/plugin-babel'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'))
const external = Object.keys(pkg.dependencies || {})

export default {
  input: 'lib/index.js',
  external,
  plugins: [
    babel({
      babelrc: false,
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', { modules: false, targets: '> 0.25%, not dead' }]
      ]
    })
  ],
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'DOMFormSerializer',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ]
}
