import React, { cloneElement, createContext, useCallback, useRef, useState } from 'react'

export const PictoContext = createContext({
  optimise: (id: string, node: React.ReactElement) => node,
  refresh: () => {},
})

interface Cache {
  [id: string]: React.ReactElement
}

interface PictoProviderProps {
  children: React.ReactNode
}

export const PictoProvider = ({ children }: PictoProviderProps) => {
  const forceUpdate = useForceUpdate()

  const cache = useRef<Cache>({})
  const isPending = useRef(false)

  const value = {
    optimise(id: string, node: React.ReactElement) {
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

interface SymbolsProps {
  cache: React.MutableRefObject<Cache>
}

const Symbols = ({ cache }: SymbolsProps) => {
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
  const [, updateState] = useState<any>()
  const forceUpdate = useCallback(() => updateState({}), [])

  return forceUpdate
}
