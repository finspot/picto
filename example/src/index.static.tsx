import fs from 'fs'
import path from 'path'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { ServerStyleSheet } from 'styled-components'

import { App } from './App'

const manifest = __non_webpack_require__('./manifest.json')

const sheet = new ServerStyleSheet()

try {
  const content = renderToString(sheet.collectStyles(<App />))
  const style = sheet.getStyleTags()
  const scripts = Object.values(manifest).map(source => `<script src="${source}"></script>`)

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>${process.env.TITLE}</title><meta name="viewport" content="width=device-width,initial-scale=1">${style}</head><body><div id="__container">${content}</div>${scripts}</body></html>`

  fs.writeFileSync(path.join(process.cwd(), 'public/index.html'), html)

  console.log('✨ Done!')
} catch (error) {
  console.error(error)
} finally {
  sheet.seal()
}
