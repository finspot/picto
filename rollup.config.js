const { babel } = require('@rollup/plugin-babel')
const fs = require('fs-extra')
const glob = require('glob')
const pascalcase = require('pascalcase')
const path = require('path')
const svg = require('rollup-plugin-react-svg')
const { uglify } = require('rollup-plugin-uglify')

const inputs = glob.sync(path.join(__dirname, 'svg/*.svg'))

const svgConfig = {
  svgo: {
    plugins: [{ removeTitle: false }, { removeViewBox: false }],
  },
}

const cjs = [
  ...inputs.map(input => ({
    external: 'react',

    input,

    output: {
      esModule: false,
      exports: 'default',
      file: `cjs/${pascalcase(path.basename(input, '.svg'))}.js`,
      format: 'cjs',
      sourcemap: true,
    },

    plugins: [svg(svgConfig)],
  })),

  {
    external: 'react',

    input: path.join(__dirname, 'modules/index.js'),

    output: {
      esModule: false,
      file: 'cjs/picto.js',
      format: 'cjs',
      sourcemap: true,
    },

    plugins: [
      svg(svgConfig),

      babel({
        babelHelpers: 'bundled',
        exclude: /node_modules/,
      }),
    ],
  },

  {
    external: 'react',

    input: path.join(__dirname, 'modules/index.js'),

    output: {
      esModule: false,
      file: 'cjs/picto.min.js',
      format: 'cjs',
      sourcemap: true,
    },

    plugins: [
      svg(svgConfig),

      babel({
        babelHelpers: 'bundled',
        exclude: /node_modules/,
      }),

      uglify(),
    ],
  },
]

const esm = [
  {
    external: 'react',

    input: path.join(__dirname, 'modules/index.js'),

    output: {
      file: 'esm/picto.js',
      format: 'esm',
      sourcemap: true,
    },

    plugins: [
      svg(svgConfig),

      babel({
        babelHelpers: 'runtime',
        exclude: /node_modules/,
        plugins: [['@babel/transform-runtime', { useESModules: true }]],
      }),
    ],
  },
]

module.exports = () => {
  const outputPath = path.join(__dirname, 'modules')
  const outputFile = path.join(outputPath, 'index.js')

  const exports = inputs.map(filename => {
    const name = pascalcase(path.basename(filename, '.svg'))
    const origin = path.relative(outputPath, filename)

    return `export { default as ${name} } from '${origin}'`
  })

  const content = exports.join('\n') + '\n'

  fs.outputFileSync(outputFile, content)

  return [...cjs, ...esm]
}
