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

  const { percent } = progress
  const [start, setStart] = useState(false) // 재생을 시작했는지 확인하는 변수
  const [count, setCount] = useState(false) // 재생횟수를 증가시켰는지 확인하는 변수
  const [startPercent, setStartPercent] = useState(0) // 언제부터 재생을 시작했는지 확인

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

    if (!count && start) {
      // 지금까지 들은 시간을 계산하여 startPercent 재설정
      setStartPercent(changedPercent - (percent - startPercent))
    }

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

  const triggerCount = useCallback(() => {
    // 서버에 음악의 재생횟수를 증가하도록 요청
    if (!currentMusic?.id) {
      return
    }
    const body = {
      musicId: currentMusic.id,
      userId,
    }

    createHistory(body)
      .then(() => setStartPercent(100))
      .catch(() => setStartPercent(100))
      .finally(() => setCount(true))
  }, [currentMusic?.id, userId])

  useEffect(() => {
    if (!start && isPlay) {
      setStart(true)
      setStartPercent(percent)
    }
    if (!isPlay) {
      setStart(false)
      setStartPercent(100)
    }
  }, [isPlay, percent, start])

  useEffect(() => {
    if (start && !count) {
      // 아직 카운트를 증가시키지 않았고 재생시간을 확인중일 때
      if (percent - startPercent >= 66) {
        // 66%이상을 들었으면 재생횟수를 증가
        triggerCount()
      }
    }
  }, [count, percent, start, startPercent, triggerCount])

  useEffect(() => {
    if (repeat === 'one' && count) {
      // 반복재생이고 한번 재생횟수 증가를 마쳤을 때
      if (percent < 1) {
        // 다시 재생하는 경우라면 재생횟수를 더 증가시킬 수 있도록 설정
        setCount(false)
        setStartPercent(percent)
      }
    }
  }, [count, percent, repeat])

  useEffect(() => {
    setCount(false)
    setStartPercent(0)
    setStart(false)
  }, [currentMusic])

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
