const { transform } = require('@babel/core')
const { babel } = require('@rollup/plugin-babel')
const fs = require('fs-extra')
const glob = require('glob')
const pascalcase = require('pascalcase')
const path = require('path')
const { optimize } = require('svgo')
const alias = require('@rollup/plugin-alias')
const { uglify } = require('rollup-plugin-uglify')
const { createFilter } = require('rollup-pluginutils')

const inputs = glob.sync(path.join(__dirname, 'svg/*.svg'))

const optimizeSvg = async (pathname, options = {}) => {
  const content = await fs.readFile(pathname, { encoding: 'utf8' })
  const optimizedSvg = await optimize(content, options)

  return optimizedSvg.data
}

const svg = options => {
  const filter = createFilter(options.include, options.exclude)

  return {
    async load(id) {
      if (!filter(id) || path.extname(id) !== '.svg') {
        return
      }

      const svg = await optimizeSvg(id, options)
      const component = await transformSvgToComponent(svg)

      return component
    },
  }
}

const svgConfig = {
  plugins: [
    {
      name: 'removeAttrs',
      params: {
        attrs: 'fill',
      },
    },
    { active: false, name: 'removeViewBox' },
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          {
            fill: 'currentColor',
          },
        ],
      },
    },
  ],
}

const transformSvgToComponent = code => {
  const transformation = transform(code, {
    babelrc: false,
    configFile: false,
    plugins: [
      require.resolve('babel-plugin-html-attributes-to-jsx'),
      require.resolve('@babel/plugin-syntax-jsx'),

      ({ types }) => {
        const restElement = types.restElement ? types.restElement : types.restProperty

        const programVisitor = {
          Program(path) {
            path.node.body.unshift(
              types.importDeclaration(
                [types.importDefaultSpecifier(types.identifier('React'))],
                types.stringLiteral('react')
              )
            )
          },
        }

        const svgExpressionVisitor = {
          ExpressionStatement(path) {
            if (!path.get('expression').isJSXElement()) {
              return
            }

            if (path.get('expression.openingElement.name').node.name !== 'svg') {
              return
            }

            const children = types.jsxFragment(
              types.jSXOpeningFragment(),
              types.jSXClosingFragment(),
              path.get('expression.children').map(({ node }) => node)
            )

            path.node.expression.children = [
              types.objectExpression([
                types.objectProperty(types.identifier('children'), types.identifier('children'), false, true),
              ]),
            ]

            path.replaceWith(
              types.exportDefaultDeclaration(
                types.arrowFunctionExpression(
                  [
                    types.objectPattern([
                      types.objectProperty(
                        types.identifier('as'),
                        types.assignmentPattern(types.identifier('Component'), types.stringLiteral('svg')),
                        false,
                        true
                      ),
                      types.objectProperty(
                        types.identifier('children'),
                        types.assignmentPattern(types.identifier('children'), children),
                        false,
                        true
                      ),
                      restElement(types.identifier('props')),
                    ]),
                  ],
                  path.get('expression').node
                )
              )
            )
          },
        }

        const svgVisitor = {
          JSXClosingElement(path) {
            if (path.node.name.name.toLowerCase() !== 'svg') {
              return
            }

            path.node.name.name = 'Component'
          },

          JSXOpeningElement(path) {
            if (path.node.name.name.toLowerCase() !== 'svg') {
              return
            }

            path.node.attributes.push(types.jSXSpreadAttribute(types.identifier('props')))
            path.node.name.name = 'Component'
          },
        }

        return {
          visitor: Object.assign({}, programVisitor, svgExpressionVisitor, svgVisitor),
        }
      },
    ],
  })

  return transformation.code
}

const cjs = modules => [
  ...Object.entries(modules).map(([name, { outputFile }]) => ({
    external: ['./core', 'react'],

    input: outputFile,

    output: {
      esModule: false,
      exports: 'default',
      file: `cjs/${name}.js`,
      format: 'cjs',
      sourcemap: true,
    },

    plugins: [
      alias({
        entries: [{ find: '../core', replacement: './core' }],
      }),

      svg(svgConfig),

      babel({
        babelHelpers: 'bundled',
        exclude: /node_modules/,
        extensions: ['.js', '.svg'],
      }),
    ],
  })),

  {
    external: ['react'],

    input: path.join(__dirname, 'core'),

    output: {
      esModule: false,
      exports: 'named',
      file: `cjs/core.js`,
      format: 'cjs',
      sourcemap: true,
    },

    plugins: [
      babel({
        babelHelpers: 'bundled',
        exclude: /node_modules/,
      }),
    ],
  },

  {
    external: ['react'],

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
        extensions: ['.js', '.svg'],
      }),
    ],
  },

  {
    external: ['react'],

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
        extensions: ['.js', '.svg'],
      }),

      uglify(),
    ],
  },
]

const esm = [
  {
    external: [/@babel\/runtime/, 'react'],

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
        extensions: ['.js', '.svg'],
        plugins: [['@babel/transform-runtime', { useESModules: true }]],
      }),
    ],
  },
]

module.exports = () => {
  const outputPath = path.join(__dirname, 'modules')

  const modules = inputs.reduce((previous, filename) => {
    const name = pascalcase(path.basename(filename, '.svg'))
    const origin = path.relative(outputPath, filename)
    const outputFile = path.join(outputPath, name + '.js')

    const code = `import React, { useContext, useEffect } from 'react'

import { PictoContext } from '../core'
import ${name} from '${origin}'

export default function WrappedPicto(props) {
  const { optimise, refresh } = useContext(PictoContext)

  useEffect(() => {
    refresh()
  }, [])

  return optimise('${name}', <${name} {...props} />)
}
`

    return { ...previous, [name]: { code, outputFile } }
  }, {})

  const manifest = `export default ${JSON.stringify(Object.keys(modules))}`
  const index = `export { PictoProvider } from '../core'
export { default as manifest } from './manifest.js'
${Object.keys(modules)
  .map(name => `export { default as ${name} } from './${name}.js'`)
  .join('\n')}
`

  Object.entries(modules).forEach(([name, { code }]) => {
    fs.outputFileSync(path.join(outputPath, `${name}.js`), code)
  })

  fs.outputFileSync(path.join(outputPath, 'manifest.js'), manifest)
  fs.outputFileSync(path.join(outputPath, 'index.js'), index)

  return [...cjs(modules), ...esm]
}
