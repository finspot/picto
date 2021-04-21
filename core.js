import React, { cloneElement, createContext, useCallback, useRef, useState } from 'react'

export const PictoContext = createContext({
  optimise: (id, node) => node,
  refresh: () => {},
})

export const PictoProvider = ({ children }) => {
  const forceUpdate = useForceUpdate()

  const cache = useRef({})
  const isPending = useRef(false)

  const value = {
    optimise(id, node) {
      if (!(id in cache.current)) {
        cache.current = { ...cache.current, [id]: node }
        isPending.current = true
      }

      return cloneElement(
        node,
        { fill: null, xmlnsXlink: 'http://www.w3.org/1999/xlink' },
        <use xlinkHref={'#' + id} />
      )
    },

    refresh() {
      if (!isPending) {
        return
      }

      forceUpdate()

      isPending.current = false
    },
  }

  return (
    <PictoContext.Provider value={value}>
      <>
        {children}
        <Symbols cache={cache} />
      </>
    </PictoContext.Provider>
  )
}

const Symbols = ({ cache }) => {
  const entries = Object.entries(cache.current)

  if (entries.length < 1) {
    return null
  }

  return (
    <svg style={{ display: 'none' }} xmlns="http://www.w3.org/2000/svg">
      {Object.entries(cache.current).map(([id, node]) =>
        cloneElement(node, { as: 'symbol', className: null, height: null, id, key: id, width: null, xmlns: null })
      )}
    </svg>
  )
}

const useForceUpdate = () => {
  const [, updateState] = useState()
  const forceUpdate = useCallback(() => updateState({}), [])

  return forceUpdate
}
