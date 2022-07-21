import type { FilterPattern } from '@rollup/pluginutils'
import { createFilter } from '@rollup/pluginutils'
import path from 'path'
import type { OptimizeOptions } from 'svgo'
import { optimize } from 'svgo'

import { optimizeSvg } from '../lib/optimizeSvg'
import { transformSvgToComponent } from '../lib/transformSvgToComponent'

interface Options extends OptimizeOptions {
  include?: FilterPattern
  exclude?: FilterPattern
}

export const svg = (options: Options = {}) => {
  const filter = createFilter(options.include, options.exclude)

  return {
    async load(id: string) {
      if (!filter(id) || path.extname(id) !== '.svg') {
        return
      }

      const svg = await optimizeSvg(id, options)
      const component = await transformSvgToComponent(svg)

      return component
    },
  }
}
