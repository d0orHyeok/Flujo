import LoadingBar from '@components/Loading/LoadingBar'
import React from 'react'
import styled from 'styled-components'

const StyledContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  background-color: rgba(0, 0, 0, 0.33);
  display: flex;
  align-items: center;
  justify-content: center;
`

const LoadingPage = () => {
  return (
    <StyledContainer>
      <LoadingBar />
    </StyledContainer>
  )
}

export default LoadingPage
