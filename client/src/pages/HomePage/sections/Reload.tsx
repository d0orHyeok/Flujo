import React from 'react'
import styled from 'styled-components'

const StyledWrppaer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
`

const StyledReload = styled.div`
  & {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
    transform: scale(120%);
  }
  & div {
    display: inline-block;
    position: absolute;
    left: 8px;
    width: 16px;
    background: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
    animation: lds-facebook 1.2s cubic-bezier(0, 0.5, 0.5, 1) infinite;
  }
  & div:nth-child(1) {
    left: 8px;
    animation-delay: -0.24s;
  }
  & div:nth-child(2) {
    left: 32px;
    animation-delay: -0.12s;
  }
  & div:nth-child(3) {
    left: 56px;
    animation-delay: 0;
  }
  @keyframes lds-facebook {
    0% {
      top: 8px;
      height: 64px;
    }
    50%,
    100% {
      top: 24px;
      height: 32px;
    }
  }
`

const Reload = () => {
  return (
    <StyledWrppaer>
      <StyledReload>
        <div></div>
        <div></div>
        <div></div>
      </StyledReload>
    </StyledWrppaer>
  )
}

export default Reload
