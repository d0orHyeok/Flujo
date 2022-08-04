import { caculateDateAgo, getGradientFromImageUrl } from '@api/functions'
import { EmptyMusicCover, EmptyMusicCoverBackgorund } from '@styles/EmptyImage'
import { IMusic } from '@appTypes/types.type.'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import styled from 'styled-components'
import { FaPlay, FaPause } from 'react-icons/fa'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { setCurrentMusic, togglePlay } from '@redux/features/player/playerSlice'
import { PrimaryButton } from '@components/Common/Button'
import * as AnyHeadStyle from '@styles/AnyHead.style'
import { Link } from 'react-router-dom'
import Waveform from '@components/Waveform/Waveform'

interface TrackHeadProps {
  music: IMusic
}

const Wrapper = styled(AnyHeadStyle.AnyHeadWrapper)``

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
`

const MusicCover = styled(AnyHeadStyle.AnyHeadImage)`
  flex-shrink: 0;
  margin-left: 30px;
`

const InfoArea = styled.div`
  width: 100%;
  min-width: 0;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  & .infoArea-flexbox {
    min-width: 0;
    width: 100%;
    display: flex;
    margin-bottom: auto;
  }

  & .infoArea-waveform {
    width: 100%;
  }

  @media screen and (max-width: 1000px) {
    height: 150px;
  }
`

const MusicInfo = styled(AnyHeadStyle.AnyHeadInfo)`
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

  ${({ theme }) => theme.device.tablet} {
    width: 30px;
    height: 30px;
    font-size: 10px;
    margin-right: 10px;
  }
`

const SubInfo = styled.div`
  flex-shrink: 0;
  text-align: right;
  margin-left: 15px;

  & .genre {
    display: inline-block;
    font-size: 0.9em;
    line-height: 0.9em;
    padding: 0.3em 0.6em;
    background-color: #999999;
    border-radius: 0.75em;
    margin-top: 1em;

    &:hover {
      background-color: gray;
    }
  }

  & .ago {
    font-size: 0.9em;
    line-height: 0.9em;
  }
`

const TrackHead = ({ music }: TrackHeadProps) => {
  const dispatch = useAppDispatch()

  const isPlay = useAppSelector((state) => state.player.controll.isPlay)
  const currentMusic = useAppSelector((state) => state.player.currentMusic)
  const [background, setBackground] = useState(EmptyMusicCoverBackgorund)

  const changeBackground = useCallback(async () => {
    if (music.cover) {
      const newBackground = await getGradientFromImageUrl(
        music.cover,
        EmptyMusicCoverBackgorund
      )
      setBackground(newBackground)
    } else {
      setBackground(EmptyMusicCoverBackgorund)
    }
  }, [music.cover])

  const handleClickPlay = useCallback(
    async (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      if (!music) {
        return
      }
      if (currentMusic?.id === music.id) {
        dispatch(togglePlay())
      } else {
        dispatch(setCurrentMusic(music))
        dispatch(togglePlay(true))
      }
    },
    [currentMusic, dispatch, music]
  )

  useLayoutEffect(() => {
    changeBackground()
  }, [changeBackground])

  return (
    <Wrapper background={background}>
      <Container>
        <InfoArea>
          <div className="infoArea-flexbox">
            <PlayButton onClick={handleClickPlay}>
              {!isPlay ? (
                <FaPlay style={{ transform: 'translateX(2px)' }} />
              ) : (
                <FaPause />
              )}
            </PlayButton>
            <MusicInfo>
              <div className="info info-main">{music.title}</div>
              <div className="info info-link">
                <Link to={`/profile/${music.userId}`}>
                  {music.user?.nickname || music.userId}
                </Link>
              </div>
            </MusicInfo>

            <SubInfo>
              <div className="ago">{caculateDateAgo(music.createdAt)}</div>
              {music.genre ? (
                <div className="genre">
                  <Link to={`/tags/${music.genre}`}>{`#${music.genre}`}</Link>
                </div>
              ) : (
                <></>
              )}
            </SubInfo>
          </div>
          <div className="infoArea-waveform">
            <Waveform music={music} active={currentMusic?.id === music.id} />
          </div>
        </InfoArea>

        <MusicCover>
          {music?.cover ? (
            <img className="img" src={music.cover} alt="" />
          ) : (
            <EmptyMusicCover className="img" />
          )}
        </MusicCover>
      </Container>
    </Wrapper>
  )
}

export default TrackHead
