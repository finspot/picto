const glob = require('glob')
const path = require('path')
const pascalcase = require('pascalcase')

const pathnames = glob.sync(path.join(__dirname, 'svg/*.svg'))

const unauthorizedPathnames = pathnames.filter(pathname => {
  const basename = path.basename(pathname, '.svg')

  return !/^[A-Z][a-zA-Z]+$/.test(basename)
})

if (unauthorizedPathnames.length > 0) {
  const errorMessage = `Incorrect naming for files :
${unauthorizedPathnames.map(pathname => {
  const relativePathname = path.relative(__dirname, pathname)
  const dirname = path.dirname(relativePathname)
  const basename = pascalcase(path.basename(pathname, '.svg'))

  return `- ./${relativePathname} (should be ./${path.join(dirname, basename)}.svg)
`
})}`

  throw new Error(errorMessage)
}
