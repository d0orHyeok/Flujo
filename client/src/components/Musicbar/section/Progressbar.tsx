import { setProgress } from '@redux/features/player/playerSlice'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import React, { useCallback, useEffect, useState } from 'react'
import convertTimeToString from '@api/functions/convertTimeToString'
import * as S from './Progressbar.style'
import { createHistory } from '@api/Hooks/historyApi'

export const DurationArea = () => {
  const progress = useAppSelector((state) => state.player.progress)
  return (
    <S.DurationBox>
      <span id="currentTime" className="currentTime">
        {progress.currentStringTime}
      </span>
      <span id="duration" className="duration">
        {progress.durationStringTime}
      </span>
    </S.DurationBox>
  )
}

const Progressbar = () => {
  const dispatch = useAppDispatch()

  const progress = useAppSelector((state) => state.player.progress)
  const { isPlay, repeat } = useAppSelector((state) => state.player.controll)
  const currentMusic = useAppSelector((state) => state.player.currentMusic)
  const userId = useAppSelector((state) => state.user.userData?.id)

  const [count, setCount] = useState({ listen: false, countMusicId: -1 }) // 재생횟수를 증가시켰는지 확인하는 변수

  const [progressHover, setProgressHover] = useState({
    hover: '',
    left: 0,
  })

  // 음악 재생막대에서 마우스 이동시 마우스위치에 해당하는 음악시간을 표시해준다.
  const handleMouseMoveProgressbar = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // 현재 마우스 위치
      const clickX = event.nativeEvent.offsetX
      // 현재 마우스 위치의 음악시간
      const mouseTime =
        progress.duration * (clickX / event.currentTarget.clientWidth)
      const mouseStringTime = convertTimeToString(mouseTime)
      setProgressHover({ left: clickX, hover: mouseStringTime })

      return { currentTime: mouseTime, currentStringTime: mouseStringTime }
    },
    [progress.duration]
  )

  const handleMouseLeaveProgressbar = () => {
    setProgressHover({ hover: '', left: 0 })
  }

  // 재생중인 음악을 클릭한 부분에 해당하는 시간에서 재생하도록 한다.
  const handleClickProgressbar = (evnet: React.MouseEvent<HTMLDivElement>) => {
    const { currentTime, currentStringTime } = handleMouseMoveProgressbar(evnet)

    const changedPercent = (currentTime / progress.duration) * 100

    dispatch(
      setProgress({
        currentTime,
        currentStringTime,
        percent: changedPercent,
      })
    )

    const musicPlayer = document
      .getElementsByTagName('audio')
      .namedItem('wave-music-player')
    if (musicPlayer) {
      musicPlayer.currentTime = currentTime
    }
  }

  const triggerCount = useCallback(async (musicId: number, userId?: string) => {
    // 서버에 음악의 재생횟수를 증가하도록 요청
    const body = {
      musicId,
      userId,
    }
    try {
      createHistory(body)
      setCount({ listen: true, countMusicId: musicId })
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    // 음악 재생을 멈추지않고 50% 들으면 재생횟수를 증가시키도록한다.
    if (currentMusic) {
      const { duration, id } = currentMusic
      const triggerTime = Math.floor((duration / 2) * 1000) // (음악 재생시간의 절반) ms
      const timeout = setTimeout(() => triggerCount(id, userId), triggerTime)

      if ((count.countMusicId === id && count.listen) || !isPlay) {
        // 일시정지 상태이거나 이미 한번 재생횟수를 증가시켰으면 취소
        clearTimeout(timeout)
      }

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [count, currentMusic, isPlay, triggerCount, userId])

  useEffect(() => {
    if (currentMusic?.id) {
      if (count.countMusicId !== currentMusic.id) {
        // 재생중인 음악이 바뀌면 count 변수를 새로 설정해준다
        setCount({ listen: false, countMusicId: currentMusic.id })
      } else {
        if (repeat === 'one' && progress.percent < 1 && count.listen) {
          // 반복재생인 경우 지속적으로 재생횟수를 증가시킬 수 있도록 설정
          setCount({ listen: false, countMusicId: currentMusic.id })
        }
      }
    }
  }, [count, currentMusic?.id, progress.percent, repeat])

  return (
    <>
      <S.ProgressBox
        onClick={handleClickProgressbar}
        onMouseMove={handleMouseMoveProgressbar}
        onMouseLeave={handleMouseLeaveProgressbar}
      >
        <span className="hoverTime" style={{ left: `${progressHover.left}px` }}>
          {progressHover.hover}
        </span>
        <div
          className="progress"
          style={{ width: `${progress.percent}%` }}
          data-current={progress.currentStringTime}
        ></div>
      </S.ProgressBox>
      <S.ProgressBackDrop className="progress-backdrop"></S.ProgressBackDrop>
    </>
  )
}

export default Progressbar
