import {
  setCurrentMusic,
  setProgress,
  togglePlay,
} from '@redux/features/player/playerSlice'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import React, { useEffect, useLayoutEffect, useRef, useCallback } from 'react'
import styled from 'styled-components'
import WaveSurfer from 'wavesurfer.js'
import { convertTimeToString } from '@api/functions'

const StyledDiv = styled.div`
  opacity: 0.6;
  transition: 0.2s ease all;

  &.active,
  &:hover {
    opacity: 1;
  }
`

const Waveform = ({ music, active = false }) => {
  const dispatch = useAppDispatch()

  const containerRef = useRef()
  const waveSurferRef = useRef()

  const progress = useAppSelector((state) => state.player.progress)
  const isPlay = useAppSelector((state) => state.player.controll.isPlay)

  // 재생중인 음악을 클릭한 부분에 해당하는 시간에서 재생하도록 한다.
  const handleClickProgressbar = useCallback(
    (event) => {
      // 현재 마우스 위치
      const clickX = event.nativeEvent.offsetX
      // 현재 마우스 위치의 음악시간
      const currentTime =
        progress.duration * (clickX / event.currentTarget.clientWidth)
      const currentStringTime = convertTimeToString(currentTime)

      const changedPercent = currentTime / progress.duration

      dispatch(
        setProgress({
          currentTime,
          currentStringTime,
          percent: changedPercent * 100,
        })
      )

      const musicPlayer = document
        .getElementsByTagName('audio')
        .namedItem('wave-music-player')
      if (musicPlayer) {
        musicPlayer.currentTime = currentTime
      }

      waveSurferRef.current.seekTo(changedPercent)
    },
    [dispatch, progress.duration]
  )

  const handleClick = useCallback(
    async (event) => {
      if (!waveSurferRef.current) return

      if (!active) {
        dispatch(setCurrentMusic(music))
        dispatch(togglePlay(true))
      } else if (!isPlay) {
        dispatch(togglePlay(true))
      } else {
        handleClickProgressbar(event)
      }
    },
    [active, dispatch, handleClickProgressbar, isPlay, music]
  )

  useLayoutEffect(() => {
    if (music.waveform) {
      const waveSurfer = WaveSurfer.create({
        container: containerRef.current,
        progressColor: 'purple',
        barWidth: 2,
        responsive: true,
        hideScrollbar: true,
        normalize: true,
      })
      waveSurfer.setVolume(0)
      waveSurfer.setHeight(60)
      waveSurfer.load(containerRef.current, JSON.parse(music.waveform).data)
      waveSurferRef.current = waveSurfer

      return () => {
        waveSurfer.destroy()
      }
    }
  }, [music.waveform])

  const setPlaying = useCallback(() => {
    if (!waveSurferRef.current) {
      return
    }

    if (active) {
      isPlay ? waveSurferRef.current.play() : waveSurferRef.current.pause()
    } else {
      waveSurferRef.current.stop()
    }
  }, [active, isPlay])

  useEffect(() => {
    setPlaying()
  }, [setPlaying])

  const setPercent = useCallback(() => {
    if (!waveSurferRef.current || !active) {
      return
    }

    if (progress.percent >= 0) {
      waveSurferRef.current.seekTo(progress.percent / 100)
    }
  }, [active, progress.percent])

  useEffect(() => {
    setPercent()
  }, [setPercent])

  return music.waveform ? (
    <StyledDiv
      ref={containerRef}
      className={active ? 'active' : undefined}
      onClick={handleClick}
    />
  ) : (
    <></>
  )
}

export default Waveform
