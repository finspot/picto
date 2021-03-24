import { manifest, PictoProvider } from '@pretto/picto'
import * as P from '@pretto/picto'
import React, { createElement, useState } from 'react'

import * as S from './styles'

const copy = value => {
  const input = document.createElement('input')

  document.body.appendChild(input)

  input.value = value
  input.select()

  const success = document.execCommand('copy')

  document.body.removeChild(input)

  return success
}

const App = () => {
  const [isAllVisible, setIsAllVisible] = useState(false)

  const handleShowMoreClick = () => {
    setIsAllVisible(true)
  }

  return (
    <PictoProvider>
      <S.GlobalStyle />

      <S.Content>
        <S.Title>{process.env.TITLE}</S.Title>

        <S.Grid>
          {manifest.slice(0, isAllVisible ? Infinity : 20).map(key => {
            const handleClick = () => {
              copy(`<P.${key} />`)
            }

            return (
              <S.PictoButton key={key} onClick={handleClick} type="button">
                {createElement(P[key], { height: 24, width: 24 })}
                <span>{key}</span>
              </S.PictoButton>
            )
          })}
        </S.Grid>

        {!isAllVisible && (
          <S.ShowMore>
            <S.ShowMoreButton onClick={handleShowMoreClick} type="button">
              Show more
            </S.ShowMoreButton>
          </S.ShowMore>
        )}
      </S.Content>
    </PictoProvider>
  )
}

export default App
