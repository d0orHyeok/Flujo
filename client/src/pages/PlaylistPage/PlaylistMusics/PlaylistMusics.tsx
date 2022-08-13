import { numberFormat } from '@api/functions'
import { IMusic } from '@appTypes/types.type.'
import { EmptyMusicCover } from '@styles/EmptyImage'
import React from 'react'
import { FaPlay } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledUl = styled.ul`
  border: 1px solid ${({ theme }) => theme.colors.border1};
`

const MusicItem = styled.li`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px;
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border1};
  }

  & .musicItem-imgBox {
    width: 30px;
    height: 30px;
    flex-shrink: 0;

    & .link,
    & .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  & .musicItem-info {
    min-width: 0;
    flex-grow: 1;
    display: flex;
    align-items: center;

    & .index,
    & .uploader,
    & .count {
      flex-shrink: 0;
    }

    & .index {
      margin: 0 10px;
      font-size: 0.9em;
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
      min-width: 0;
      color: ${({ theme }) => theme.colors.bgText};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
  }
`

interface PlaylistMusicsProps {
  musics: IMusic[]
}

const PlaylistMusics = ({ musics }: PlaylistMusicsProps) => {
  return (
    <>
      {musics ? (
        <StyledUl>
          {musics.map((music, index) => (
            <MusicItem key={index}>
              <div className="musicItem-imgBox">
                <Link
                  className="link"
                  to={`/track/${music.userId}/${music.permalink}`}
                >
                  {music.cover ? (
                    <img className="img" src={music.cover} alt="" />
                  ) : (
                    <EmptyMusicCover className="img" />
                  )}
                </Link>
              </div>
              <div className="musicItem-info">
                <div className="index">{index + 1}</div>
                <div className="uploader">
                  <Link to={`/profile/${music.userId}`}>
                    {music.user.nickname || music.userId}
                  </Link>
                </div>
                <div className="title">
                  <Link to={`/track/${music.userId}/${music.permalink}`}>
                    {music.title}
                  </Link>
                </div>
                {music.count ? (
                  <div className="count">
                    <FaPlay className="icon play" />
                    {numberFormat(music.count)}
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </MusicItem>
          ))}
        </StyledUl>
      ) : (
        <></>
      )}
    </>
  )
}

export default PlaylistMusics
