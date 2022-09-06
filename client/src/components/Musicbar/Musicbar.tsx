import React, { useCallback, useEffect, useRef, useState } from 'react'
import * as S from './Musicbar.style'
import {
  BsVolumeMuteFill,
  BsVolumeDownFill,
  BsVolumeUpFill,
} from 'react-icons/bs'
import { FaPlay, FaPause, FaStepForward, FaStepBackward } from 'react-icons/fa'
import { RiPlayListFill } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import MusicListDrawer from './MusicListDrawer/MusicListDrawer'
import {
  ShuffleButton,
  RepeatButton,
  LikeButton,
  FollowButton,
} from '@components/Common/Button'
import convertTimeToString from '@api/functions/convertTimeToString'
import Progressbar, { DurationArea } from './section/Progressbar'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import {
  nextMusic,
  prevMusic,
  setProgress,
  togglePlay,
  toggleRepeat,
  toggleShuffle,
} from '@redux/features/player/playerSlice'
import Musiclist from './MusicListDrawer/section/Musiclist'
import { selectUser } from '@redux/features/user/userSlice'
import { userToggleFollow, userToggleLike } from '@redux/thunks/userThunks'
import EmptyMusicCover from '@styles/EmptyImage/EmptyMusicCover.style'

// 로컬스토리지에 저장된 볼륨값을 확인하여 가져오고 없다면 100을 리턴
const getLocalVolume = () => {
  return parseInt(window.localStorage.getItem('volume') || '100')
}

const Musicbar = () => {
  const dispatch = useAppDispatch()

  const user = useAppSelector(selectUser)
  const { isPlay, isShuffle, repeat } = useAppSelector(
    (state) => state.player.controll
  )
  const { currentIndex, indexArray } = useAppSelector(
    (state) => state.player.indexing
  )
  const currentMusic = useAppSelector((state) => state.player.currentMusic)

  const [openDrawer, setOpenDrawer] = useState(false)
  const [volume, setVolume] = useState(getLocalVolume())
  const [isLike, setIsLike] = useState(false)
  const [isFollow, setIsFollow] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)

  const toggleDrawer = useCallback(() => {
    if (!indexArray.length) {
      return
    }
    setOpenDrawer(!openDrawer)
  }, [indexArray, openDrawer])

  const handleCloseDrawer = useCallback(() => {
    setOpenDrawer(false)
  }, [])

  // 볼륨을 조절하고 변화된 볼륨값을 로컬스토리지에 저장한다.
  const handleChangeVolume = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newVolume = event.currentTarget.value
      setVolume(parseInt(newVolume))
      window.localStorage.setItem('volume', newVolume)
    },
    []
  )

  const toggleMute = useCallback(() => {
    setVolume(volume ? 0 : getLocalVolume())
  }, [volume])

  // 재생중인 음악의 현재시간변화 감지하고 재생이 끝나면 다음 곡을 재생
  const handleChangeAudioTime = (
    event: React.ChangeEvent<HTMLAudioElement>
  ) => {
    const { currentTime, duration } = event.currentTarget

    if (currentTime === duration) {
      // 재생목록의 마지막곡이고 반복재생이 아닌경우는 다음곡 재생을 스킵
      if (repeat === 'one') {
        event.currentTarget.currentTime = 0
        event.currentTarget.play()
        return
      }
      if (!repeat && indexArray.length - 1 == currentIndex) {
        return dispatch(togglePlay(false))
      }
      return dispatch(nextMusic())
    }

    const newCurrentStringTime = convertTimeToString(currentTime)

    dispatch(
      setProgress({
        currentTime,
        percent: (currentTime / duration) * 100,
        currentStringTime: newCurrentStringTime,
      })
    )
  }

  // 새로운 음악을 불러오면 현재시간과 음악전체시간을 초기화
  const handleLoadedMetadata = useCallback(
    (event: React.ChangeEvent<HTMLAudioElement>) => {
      const { duration } = event.currentTarget
      const newDurationStringTime = convertTimeToString(duration)

      dispatch(
        setProgress({
          currentTime: 0,
          currentStringTime: '0:00',
          durationStringTime: newDurationStringTime,
          percent: 0,
          duration,
        })
      )
    },
    [dispatch]
  )

  const handleClickLike = () => {
    if (currentMusic) {
      dispatch(
        userToggleLike({ targetId: currentMusic.id, targetType: 'music' })
      )
    }
  }

  const handleClickFollow = () => {
    if (currentMusic) {
      dispatch(userToggleFollow(currentMusic.userId))
    }
  }

  // volume state가 변화하면 audio 태그에 자동으로 적용
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current) {
      setTimeout(
        () =>
          isPlay
            ? audioRef.current?.play().catch((err) => console.log(err))
            : audioRef.current?.pause(),
        100
      )
    }
  }, [isPlay, currentIndex])

  useEffect(() => {
    if (!indexArray.length) {
      setOpenDrawer(false)
    }
  }, [indexArray])

  useEffect(() => {
    if (
      user.userData?.likeMusics.length &&
      currentMusic &&
      user.userData.likeMusics.findIndex((lm) => lm.id === currentMusic.id) !==
        -1
    ) {
      setIsLike(true)
    } else {
      setIsLike(false)
    }
  }, [currentMusic, user.userData?.likeMusics])

  useEffect(() => {
    let bol = false
    if (user.userData?.following && currentMusic) {
      bol =
        user.userData.following.findIndex(
          (f) => f.id === currentMusic.userId
        ) !== -1
    }
    setIsFollow(bol)
  }, [currentMusic, user.userData?.following])

  return (
    <>
      {/* <Progressbar audioRef={audioRef} /> */}
      <S.Wrapper id="player">
        {/* <!-- Music --> */}
        <audio
          id="wave-music-player"
          ref={audioRef}
          src={currentMusic?.link}
          onTimeUpdate={handleChangeAudioTime}
          onLoadedMetadata={handleLoadedMetadata}
        ></audio>
        <S.Container>
          <S.InfoBox>
            <S.InfoArea>
              {currentMusic ? (
                <>
                  {/* Music Image */}
                  <div className="img-container">
                    {currentMusic.cover ? (
                      <img
                        className="img"
                        src={currentMusic.cover}
                        alt="Album Art"
                      />
                    ) : (
                      <EmptyMusicCover className="img" />
                    )}
                  </div>
                  {/* Music Info */}
                  <div className="music-info">
                    <h3 id="music-uploader" className="uploader">
                      <Link to={`/profile/${currentMusic.userId}`}>
                        {currentMusic?.user
                          ? currentMusic?.user.nickname
                          : currentMusic?.userId}
                      </Link>
                    </h3>
                    <h2 id="music-title" className="title">
                      <Link
                        to={`/track/${currentMusic.userId}/${currentMusic.permalink}`}
                      >
                        {currentMusic?.title || ''}
                      </Link>
                    </h2>
                  </div>
                  {/* Buttons */}
                  <div className="music-btns">
                    <LikeButton
                      title="Like"
                      className="svgBtn"
                      isLike={isLike}
                      onClick={handleClickLike}
                    />
                    <FollowButton
                      title="Follow"
                      className="svgBtn"
                      isFollow={isFollow}
                      onClick={handleClickFollow}
                    />
                  </div>
                </>
              ) : (
                <></>
              )}
            </S.InfoArea>
          </S.InfoBox>

          {/* <!-- Controls --> */}
          <S.ControllBox>
            {/* Play Controll */}
            <S.ControllArea>
              <ShuffleButton
                title="Shuffle"
                className="btn specialBtn"
                shuffle={isShuffle}
                onClick={() => dispatch(toggleShuffle())}
              />
              <button
                title={'Prev'}
                className="btn backwardBtn"
                onClick={() => dispatch(prevMusic())}
              >
                <FaStepBackward />
              </button>
              <button
                title={isPlay ? 'Pause' : 'Play'}
                className="btn playBtn"
                onClick={() => dispatch(togglePlay())}
              >
                {!isPlay ? <FaPlay /> : <FaPause />}
              </button>
              <button
                title="Next"
                className="btn fowardBtn"
                onClick={() => dispatch(nextMusic())}
              >
                <FaStepForward />
              </button>
              <RepeatButton
                title="Repeat"
                className="btn specialBtn"
                repeat={repeat}
                onClick={() => dispatch(toggleRepeat())}
              />
            </S.ControllArea>
          </S.ControllBox>
          <S.SubControllBox>
            {/* Show duration */}
            <DurationArea />
            {/* Volume Controll */}
            <S.VolumeArea>
              <S.VolumeControll className="volume-controll">
                <div ref={volumeRef} className="volume-container">
                  <input
                    type="range"
                    className="volume"
                    min={0}
                    max={100}
                    value={volume}
                    onChange={handleChangeVolume}
                  />
                </div>
              </S.VolumeControll>
              <button className="svgBtn" onClick={toggleMute}>
                {volume === 0 ? (
                  <BsVolumeMuteFill />
                ) : volume > 50 ? (
                  <BsVolumeUpFill />
                ) : (
                  <BsVolumeDownFill />
                )}
              </button>
            </S.VolumeArea>
            <S.PlaylistArea>
              <button
                title="Next up"
                className={`svgBtn drawerBtn ${
                  indexArray.length ? '' : 'block'
                }`}
                onClick={toggleDrawer}
              >
                <RiPlayListFill />
              </button>
            </S.PlaylistArea>
          </S.SubControllBox>
          {/* Progress bar */}
          {currentMusic ? <Progressbar /> : <></>}
        </S.Container>
      </S.Wrapper>
      <MusicListDrawer open={openDrawer} onClose={handleCloseDrawer}>
        <Musiclist />
      </MusicListDrawer>
    </>
  )
}

export default React.memo(Musicbar)
