import * as P from '@pretto/picto'
import React from 'react'
import { render } from 'react-dom'

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

const Example = () => (
  <>
    <S.GlobalStyle />

    <S.Content>
      <S.Title>@pretto/picto</S.Title>

      <S.Grid>
        {Object.entries(P).map(([key, Picto]) => {
          const handleClick = () => {
            copy(`<P.${key} />`)
          }

          return (
            <S.PictoButton key={key} onClick={handleClick} type="button">
              <Picto fill="currentcolor" />
              <span>{key}</span>
            </S.PictoButton>
          )
        })}
      </S.Grid>
    </S.Content>
  </>
)

const container = document.createElement('div')

document.body.appendChild(container)

render(<Example />, container)
