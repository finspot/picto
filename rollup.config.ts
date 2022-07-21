import { babel } from '@rollup/plugin-babel'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import fs from 'fs-extra'
import glob from 'glob'
import path from 'path'
import shorthash from 'shorthash'
import type { AddAttributesToSVGElementPlugin, RemoveAttrsPlugin, RemoveViewBoxPlugin } from 'svgo'

import { svg } from './plugins/svg'

const svgConfig = {
  plugins: [
    {
      name: 'removeAttrs',
      params: {
        attrs: 'fill',
      },
    } as RemoveAttrsPlugin,
    { active: false, name: 'removeViewBox' } as RemoveViewBoxPlugin,
    {
      name: 'addAttributesToSVGElement',
      params: {
        attributes: [
          {
            fill: 'currentColor',
          },
        ],
      },
    } as AddAttributesToSVGElementPlugin,
  ],
}

interface Module {
  code: string
  filename: string
  moduleFilename: string
  modulePathname: string
}

export default () => {
  const modulesPathname = path.join(__dirname, 'modules')

  const modules = glob.sync(path.join(__dirname, 'svg/*.svg')).reduce<Array<Module>>((previous, pathname) => {
    const filename = path.basename(pathname, '.svg')
    const id = 'p_' + shorthash.unique(filename)

    const originRelativePathname = path.relative(modulesPathname, pathname)

    const moduleFilename = `${filename}.tsx`
    const modulePathname = path.join(modulesPathname, moduleFilename)

    const code = `import React, { useContext, useEffect } from 'react';

import { PictoContext } from '../core';
import SVGComponent from '${originRelativePathname}';

export const ${filename} = (props: React.SVGProps<SVGElement>): JSX.Element => {
  const { optimise, refresh } = useContext(PictoContext);

  useEffect(() => {
    refresh();
  }, []);

  return optimise('${id}', <SVGComponent {...props} />);
};
`

    return [...previous, { code, filename, moduleFilename, modulePathname }]
  }, [])

  modules.forEach(({ code, modulePathname }) => {
    fs.outputFileSync(modulePathname, code)
  })

  fs.outputFileSync(
    path.join(modulesPathname, 'manifest.ts'),
    `export type Picto = ${modules.map(({ filename }) => JSON.stringify(filename)).join(' | ')};

export const manifest: Picto[] = ${JSON.stringify(
      modules.map(({ filename }) => filename),
      null,
      2
    )};
`
  )

  fs.outputFileSync(
    path.join(modulesPathname, 'index.ts'),
    `export { PictoProvider } from '../core';
export { manifest } from './manifest'
export type { Picto } from './manifest'
${modules.map(({ filename }) => `export { ${filename} } from './${filename}';`).join('\n')}
`
  )

  return [
    {
      // don't embed dependencies in the library and let the magic of node_modules do the job
      external: [/^@babel\/runtime/, 'react'],

      input: path.join(__dirname, 'modules/index.ts'),

      output: {
        file: 'esm/picto.js',
        format: 'esm',
        sourcemap: true,
      },

      plugins: [
        nodeResolve({
          // resolve file .tsx when no extension is provided
          extensions: ['.ts', '.tsx'],
        }),

        svg(svgConfig),

        babel({
          // cf. https://github.com/rollup/plugins/tree/master/packages/babel#babelhelpers
          // when building libraries
          babelHelpers: 'runtime',
          extensions: ['.svg', '.ts', '.tsx'],
          // required when `babelHelpers: runtime`
          plugins: [['@babel/transform-runtime', { useESModules: true }]],
          presets: [['@babel/preset-react', { runtime: 'classic' }], '@babel/preset-typescript'],
        }),
      ],
    },
  ]
}
