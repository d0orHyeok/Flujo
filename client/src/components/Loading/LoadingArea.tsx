import React from 'react'
import styled from 'styled-components'
import LoadingBar from './LoadingBar'
import { InView } from 'react-intersection-observer'

const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
`

interface LodaingAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  loading: boolean
  hide?: boolean
  onInView?: (inView: boolean) => void
}

const LoadingArea = ({
  loading,
  onInView,
  hide,
  ...props
}: LodaingAreaProps) => {
  return hide ? null : !loading ? (
    <InView as="div" onChange={onInView}>
      <StyledDiv {...props}></StyledDiv>
    </InView>
  ) : (
    <StyledDiv {...props}>
      <LoadingBar />
    </StyledDiv>
  )
}

export default LoadingArea
