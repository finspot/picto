import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'

import { App } from './App'

const container = document.getElementById('__container')

if (!container) {
  const container = document.createElement('div')

  document.body.appendChild(container)

  const root = createRoot(container)

  root.render(<App />)
} else {
  hydrateRoot(container, <App />)
}
