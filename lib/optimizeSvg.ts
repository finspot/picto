import fs from 'fs-extra'
import { optimize } from 'svgo'

export const optimizeSvg = async (pathname: string, options = {}): Promise<string> => {
  const content = await fs.readFile(pathname, { encoding: 'utf8' })
  const optimizedSvg = await optimize(content, options)

  if (optimizedSvg.error !== undefined) {
    throw new Error('SVG could not be optimized')
  }

  return optimizedSvg.data
}
