import React, { useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'
import WaveSurfer from 'wavesurfer.js'

const StyledDiv = styled.div`
  opacity: 0.6;
  transition: 0.2s ease all;

  &.active,
  &:hover {
    opacity: 1;
  }
`

const Waveform = ({ link }) => {
  const containerRef = useRef()
  const waveSurferRef = useRef()

  useLayoutEffect(() => {
    const waveSurfer = WaveSurfer.create({
      container: containerRef.current,
      progressColor: 'purple',
      barWidth: 2,
    })
    waveSurfer.setHeight(60)
    waveSurfer.load(link)
    waveSurfer.on('ready', () => {
      waveSurferRef.current = waveSurfer
    })

    return () => {
      waveSurfer.destroy()
    }
  }, [link])

  return (
    <>
      <StyledDiv ref={containerRef} />
    </>
  )
}

export default Waveform
