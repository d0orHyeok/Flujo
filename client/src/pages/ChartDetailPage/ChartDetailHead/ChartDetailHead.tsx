import styled from 'styled-components'
import React, { useState, useCallback, useLayoutEffect, useEffect } from 'react'
import { IMusic } from '@appTypes/types.type.'
import { EmptyMusicCover, EmptyMusicCoverBackgorund } from '@styles/EmptyImage'
import * as AnyHeadStyle from '@styles/AnyHead.style'
import { PrimaryButton } from '@components/Common/Button'
import { FaPlay, FaPause } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { convertTimeToString, getGradientFromImageUrl } from '@api/functions'
import { Link } from 'react-router-dom'
import {
  addMusic,
  clearMusics,
  togglePlay,
} from '@redux/features/player/playerSlice'

const Wrapper = styled(AnyHeadStyle.AnyHeadWrapper)`
  position: relative;
`

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
`

const ChartImage = styled(AnyHeadStyle.AnyHeadImage)`
  flex-shrink: 0;
  margin-left: 2em;
  width: 200px;
  height: 200px;
`

const ChartInfo = styled(AnyHeadStyle.AnyHeadInfo)`
  margin-right: auto;

  & .info.info-link:hover {
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
  }
`

const PlayButton = styled(PrimaryButton)`
  flex-shrink: 0;
  margin-right: 15px;
  width: 50px;
  height: 50px;
  font-size: 20px;
  border-radius: 25px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

const ChartMusics = styled.div`
  position: absolute;
  bottom: 30px;
  left: 30px;

  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  height: 100px;
  width: 100px;
  border-radius: 50px;
  background-color: black;
  color: white;

  & .musicCount {
    font-size: 20px;
    margin-bottom: 10px;
  }

  & .durationSum {
    color: #929292;
  }
`

interface ChartDetailHeadProps {
  title: string
  musics: IMusic[]
}

const ChartDetailHead = ({ title, musics }: ChartDetailHeadProps) => {
  const dispatch = useAppDispatch()

  const isPlay = useAppSelector((state) => state.player.controll.isPlay)
  const nextups = useAppSelector((state) => state.player.musics)
  const firstMusic = musics[0]

  const [active, setActive] = useState(false)

  const [background, setBackground] = useState<string>(
    EmptyMusicCoverBackgorund
  )

  const handleClickPlay = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      if (!active) {
        dispatch(clearMusics())
        dispatch(addMusic(musics))
        dispatch(togglePlay(true))
      } else {
        dispatch(togglePlay())
      }
    },
    [active, dispatch, musics]
  )

  const changeBackground = useCallback(async () => {
    if (firstMusic.cover) {
      const newBackground = await getGradientFromImageUrl(
        firstMusic.cover,
        EmptyMusicCoverBackgorund
      )
      setBackground(newBackground)
    } else {
      setBackground(EmptyMusicCoverBackgorund)
    }
  }, [firstMusic?.cover])

  useEffect(() => {
    if (nextups.length !== musics.length) {
      setActive(false)
    } else {
      const bol =
        nextups.findIndex(
          (nextup) => musics.findIndex((m) => m.id === nextup.id) === -1
        ) === -1
      setActive(bol)
    }
  }, [nextups, musics])

  useLayoutEffect(() => {
    changeBackground()
  }, [changeBackground])

  return (
    <Wrapper background={background}>
      <Container>
        <PlayButton onClick={handleClickPlay}>
          {!isPlay || !active ? (
            <FaPlay style={{ transform: 'translateX(2px)' }} />
          ) : (
            <FaPause />
          )}
        </PlayButton>
        <ChartInfo>
          <div className="info info-main">{title}</div>
          <div className="info info-link">
            <Link to="/">Wave</Link>
          </div>
        </ChartInfo>

        <ChartImage>
          {firstMusic?.cover ? (
            <img className="img" src={firstMusic.cover} alt="" />
          ) : (
            <EmptyMusicCover className="img" />
          )}
        </ChartImage>
      </Container>

      <ChartMusics>
        <div className="musicCount">{musics.length}</div>
        <div>TRACKS</div>
        {musics ? (
          <div className="durationSum">
            {convertTimeToString(
              musics.reduce((prev, value) => prev + value.duration, 0)
            )}
          </div>
        ) : (
          <></>
        )}
      </ChartMusics>
    </Wrapper>
  )
}

export default ChartDetailHead
