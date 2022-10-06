import { numberFormat } from '@api/functions'
import { IMusic } from '@appTypes/types.type.'
import InteractionButtons from '@components/InteractionBar/InteractionButtons'
import {
  addMusic,
  clearMusics,
  setCurrentMusic,
  togglePlay,
} from '@redux/features/player/playerSlice'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { EmptyMusicCover } from '@styles/EmptyImage'
import React, { useCallback, useEffect, useState } from 'react'
import { FaPause, FaPlay } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledUl = styled.ul``

const MusicItem = styled.li`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px;
  border-radius: 3px;
  cursor: pointer;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border1};
  }

  &:hover,
  &.active {
    background-color: ${({ theme }) => theme.colors.border1};
  }

  & .musicItem-imgBox {
    width: 30px;
    height: 30px;
    flex-shrink: 0;
    position: relative;

    & .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    & .hoverIcon {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: ${({ theme }) => theme.colors.bgText};
      font-size: 12px;
      line-height: 12px;
      filter: drop-shadow(0 0 3px black);
    }
  }

  & .musicItem-info {
    min-width: 0;
    flex-grow: 1;
    display: flex;
    align-items: center;

    & .index,
    & .count,
    & .uploader {
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
    }

    & .index,
    & .count {
      flex-shrink: 0;
    }

    & .index {
      margin: 0 10px;
      font-size: 0.9em;
    }

    & .uploader,
    & .title {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    & .uploader {
      & a:hover {
        color: ${({ theme }) => theme.colors.bgText};
      }

      &::after {
        content: '-';
        margin: 0 5px;
      }
    }

    & .title {
      color: ${({ theme }) => theme.colors.bgText};
    }

    & .count {
      margin-left: auto;
      margin-right: 4px;
      font-size: 12px;

      & .icon.play {
        font-size: 10px;
        margin-right: 5px;
      }
    }

    & .musicItem-hover {
      margin-left: auto;
      padding-left: 8px;
      flex-shrink: 0;
    }
  }
`

interface PlaylistMusicsProps {
  musics: IMusic[]
}

const PlaylistMusics = ({ musics }: PlaylistMusicsProps) => {
  const dispatch = useAppDispatch()

  const isPlay = useAppSelector((state) => state.player.controll.isPlay)
  const nextups = useAppSelector((state) => state.player.musics)
  const currentMusic = useAppSelector((state) => state.player.currentMusic)

  const [active, setActive] = useState(false)
  const [hoverIndex, setHoverIndex] = useState(-1)

  const handleClickPlay = useCallback(
    (music: IMusic) => {
      if (!active) {
        dispatch(clearMusics())
        dispatch(addMusic(musics))
        dispatch(setCurrentMusic(music))
        dispatch(togglePlay(true))
      } else {
        if (currentMusic?.id === music.id) {
          dispatch(togglePlay())
        } else {
          dispatch(setCurrentMusic(music))
          dispatch(togglePlay(true))
        }
      }
    },
    [active, currentMusic?.id, dispatch, musics]
  )

  const changeActive = useCallback(() => {
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

  const handleMouseOver = useCallback(
    (index: number) => (event: React.MouseEvent<HTMLLIElement>) => {
      event.preventDefault()
      setHoverIndex(index)
    },
    []
  )

  const handleMouseLeave = useCallback(
    (event: React.MouseEvent<HTMLUListElement>) => {
      event.preventDefault()
      setHoverIndex(-1)
    },
    []
  )

  const handleClickItem = useCallback(
    (music: IMusic) => (event: React.MouseEvent<HTMLLIElement>) => {
      event.preventDefault()
      event.stopPropagation()
      handleClickPlay(music)
    },
    [handleClickPlay]
  )

  useEffect(() => {
    changeActive()
  }, [changeActive])

  return musics ? (
    <StyledUl onMouseLeave={handleMouseLeave}>
      {musics.map((music, index) => {
        const className =
          currentMusic?.id === music.id && active && isPlay
            ? 'active'
            : undefined
        const show = hoverIndex === index || Boolean(className)
        return (
          <MusicItem
            key={index}
            className={className}
            onMouseOver={handleMouseOver(index)}
            onClick={handleClickItem(music)}
          >
            <div className="musicItem-imgBox">
              {music.cover ? (
                <img className="img" src={music.cover} alt="" />
              ) : (
                <EmptyMusicCover className="img" />
              )}
              {show ? (
                <span className="hoverIcon" title={isPlay ? 'Pause' : 'Play'}>
                  {!Boolean(className) ? <FaPlay /> : <FaPause />}
                </span>
              ) : null}
            </div>
            <div className="musicItem-info">
              <div className="index">{index + 1}</div>
              <div className="uploader">
                <Link
                  to={`/profile/${music.userId}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  {music.user?.nickname || music.user?.username || music.userId}
                </Link>
              </div>
              <div className="title">
                <Link
                  to={`/track/${music.userId}/${music.permalink}`}
                  onClick={(event) => event.stopPropagation()}
                >
                  {music.title}
                </Link>
              </div>

              {show ? (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  className="musicItem-hover"
                  onClick={(event) => event.stopPropagation()}
                >
                  <InteractionButtons
                    target={music}
                    mediaSize={3000}
                    disableEdit={true}
                  />
                </div>
              ) : music.count ? (
                <div className="count">
                  <FaPlay className="icon play" />
                  {numberFormat(music.count)}
                </div>
              ) : (
                <></>
              )}
            </div>
          </MusicItem>
        )
      })}
    </StyledUl>
  ) : (
    <></>
  )
}

export default PlaylistMusics
