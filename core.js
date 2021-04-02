import React, { cloneElement, createContext, useCallback, useRef, useState } from 'react'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 5)

export const PictoContext = createContext({
  optimise: (id, node) => node,
  prefix: nanoid(),
  refresh: () => {},
})

export const PictoProvider = ({ children }) => {
  const forceUpdate = useForceUpdate()

  const cache = useRef({})
  const isPending = useRef(false)
  const prefix = useRef(nanoid())

  const value = {
    optimise(baseID, node) {
      const prefixedID = baseID + '_' + prefix.current

      if (!(prefixedID in cache.current)) {
        cache.current = { ...cache.current, [prefixedID]: node }
        isPending.current = true
      }

      return cloneElement(
        node,
        { fill: null, xmlnsXlink: 'http://www.w3.org/1999/xlink' },
        <use xlinkHref={'#' + prefixedID} />
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
