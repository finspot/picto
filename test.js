import glob from 'glob'
import pascalcase from 'pascalcase'
import path from 'path'
import url from 'url'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const pathnames = glob.sync(path.join(__dirname, 'svg/*.svg'))

const unauthorizedPathnames = pathnames.filter(pathname => {
  const basename = path.basename(pathname, '.svg')

  return !/^[A-Z][a-zA-Z]+$/.test(basename)
})

if (unauthorizedPathnames.length > 0) {
  const errorMessage = `Incorrect naming for files:
${unauthorizedPathnames
  .map(pathname => {
    const relativePathname = path.relative(__dirname, pathname)
    const dirname = path.dirname(relativePathname)
    const basename = pascalcase(path.basename(pathname, '.svg'))

    return `- ./${relativePathname} (must be ./${path.join(dirname, basename)}.svg)`
  })
  .join('\n')}`

  throw new Error(errorMessage)
}
