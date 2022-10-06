import React from 'react'
import styled, { css } from 'styled-components'

const StyledReload = styled.div<{ size?: number }>`
  ${({ size }) => {
    const contentWidth = size || 80
    const boxWidth = Math.floor(contentWidth / 5)
    const space = Math.floor(boxWidth / 2)

    return css`
      & {
        display: inline-block;
        position: relative;
        width: ${contentWidth}px;
        height: ${contentWidth}px;
      }
      & div {
        display: inline-block;
        position: absolute;
        left: ${space}px;
        width: ${boxWidth}px;
        background: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
        animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
      }
      & div:nth-child(1) {
        left: ${space}px;
        animation-delay: -0.24s;
      }
      & div:nth-child(2) {
        left: ${2 * boxWidth}px;
        animation-delay: -0.12s;
      }
      & div:nth-child(3) {
        left: ${3 * boxWidth + space}px;
        animation-delay: 0;
      }
      @keyframes lds-facebook {
        0% {
          top: ${space}px;
          height: ${contentWidth - boxWidth}px;
        }
        50%,
        100% {
          top: ${boxWidth + space}px;
          height: ${boxWidth * 2}px;
        }
      }
    `
  }};
`

interface ReloadPorps extends React.HTMLAttributes<HTMLDivElement> {
  size?: number
}

const Reload = (props: ReloadPorps) => {
  return (
    <StyledReload {...props}>
      <div></div>
      <div></div>
      <div></div>
    </StyledReload>
  )
}

export default Reload
