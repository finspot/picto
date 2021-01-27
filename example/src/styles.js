import styled, { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: tomato;
    color: white;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;

    -webkit-font-smoothing: antialiased;
  }

  * {
    margin: 0;
  }
`

export const Content = styled.div`
  margin: 16px;

  @media screen and (min-width: 720px) {
    margin: 32px;
  }

  @media screen and (min-width: 1024px) {
    margin: 64px auto;
    max-width: 896px;
  }
`

export const Grid = styled.div`
  display: grid;
  grid-gap: 24px;
  grid-template-columns: repeat(auto-fill, 128px);
  grid-template-rows: 24px;
`

export const PictoButton = styled.button`
  align-items: center;
  appearance: none;
  background: initial;
  border: none;
  color: inherit;
  cursor: pointer;
  display: grid;
  font: inherit;
  grid-gap: 8px;
  grid-template-columns: 24px 1fr;
  grid-template-rows: 24px;
  outline: 0;
  padding: 0;
  text-align: inherit;
  transition: color 400ms cubic-bezier(0.25, 1, 0.5, 1);

  &:focus,
  &:hover {
    color: darkRed;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export const Title = styled.h1`
  margin-bottom: 24px;

  @media screen and (min-width: 1024px) {
    margin-bottom: 32px;
  }
`
