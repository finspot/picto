import React from 'react'
import { hydrate, render } from 'react-dom'

import App from './App'

const container = document.getElementById('__container')

if (!container) {
  const container = document.createElement('div')

  document.body.appendChild(container)

  render(<App />, container)
} else {
  hydrate(<App />, container)
}
