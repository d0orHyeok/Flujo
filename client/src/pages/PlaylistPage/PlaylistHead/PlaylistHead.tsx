import styled from 'styled-components'
import React, { useState, useCallback, useLayoutEffect } from 'react'
import { IPlaylist } from '@appTypes/types.type.'
import {
  EmptyPlaylistImage,
  EmptyPlaylistImageBackground,
} from '@styles/EmptyImage'
import * as AnyHeadStyle from '@styles/AnyHead.style'
import { PrimaryButton } from '@components/Common/Button'
import { FaPlay, FaPause } from 'react-icons/fa'
import { useAppSelector } from '@redux/hook'
import {
  caculateDateAgo,
  convertTimeToString,
  getGradientFromImageUrl,
} from '@api/functions'
import { Link } from 'react-router-dom'

const Wrapper = styled(AnyHeadStyle.AnyHeadWrapper)`
  position: relative;
`

const Container = styled.div`
  display: flex;
  align-items: flex-start;
  position: relative;
`

const PlaylistImage = styled(AnyHeadStyle.AnyHeadImage)`
  flex-shrink: 0;
  margin-left: 2em;
  width: 250px;
  height: 250px;

  @media screen and (max-width: 1000px) {
    width: 200px;
    height: 200px;
  }

  @media screen and (max-width: 600px) {
    width: 125px;
    height: 125px;
  }

  ${({ theme }) => theme.device.mobile} {
    display: none;
  }
`

const PlaylistInfo = styled(AnyHeadStyle.AnyHeadInfo)`
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
  margin-left: 1em;

  ${({ theme }) => theme.device.tablet} {
    display: none;
  }

  & .ago {
    font-size: 0.9em;
    line-height: 0.9em;
  }
`

const PlaylistMusicCounter = styled.div`
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

  ${({ theme }) => theme.device.tablet} {
    bottom: 20px;
    left: 20px;
  }

  @media screen and (max-width: 600px) {
    display: none;
  }
`

interface PlaylistHeadProps {
  playlist: IPlaylist
}

const PlaylistHead = ({ playlist }: PlaylistHeadProps) => {
  const isPlay = useAppSelector((state) => state.player.controll.isPlay)

  const [background, setBackground] = useState<string>(
    EmptyPlaylistImageBackground
  )

  const changeBackground = useCallback(async () => {
    if (playlist.image) {
      const newBackground = await getGradientFromImageUrl(
        playlist.image,
        EmptyPlaylistImageBackground
      )
      setBackground(newBackground)
    } else {
      setBackground(EmptyPlaylistImageBackground)
    }
  }, [playlist.image])

  useLayoutEffect(() => {
    changeBackground()
  }, [changeBackground])

  return (
    <Wrapper background={background}>
      <Container>
        <PlayButton>
          {!isPlay ? (
            <FaPlay style={{ transform: 'translateX(2px)' }} />
          ) : (
            <FaPause />
          )}
        </PlayButton>
        <PlaylistInfo>
          <div className="info info-main">{playlist.name}</div>
          <div className="info info-link">
            <Link to={`/profile/${playlist.userId}`}>
              {playlist.user?.nickname || playlist.userId}
            </Link>
          </div>
        </PlaylistInfo>

        <SubInfo>
          <div className="ago">{caculateDateAgo(playlist.createdAt)}</div>
        </SubInfo>

        <PlaylistImage>
          {playlist?.image ? (
            <img className="img" src={playlist.image} alt="" />
          ) : (
            <EmptyPlaylistImage className="img" />
          )}
        </PlaylistImage>
      </Container>

      <PlaylistMusicCounter>
        <div className="musicCount">{playlist.musicsCount}</div>
        <div>TRACKS</div>
        {playlist.musics ? (
          <div className="durationSum">
            {convertTimeToString(
              playlist.musics.reduce((prev, value) => prev + value.duration, 0)
            )}
          </div>
        ) : (
          <></>
        )}
      </PlaylistMusicCounter>
    </Wrapper>
  )
}

export default PlaylistHead
