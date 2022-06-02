import { numberFormat } from '@api/functions'
import { IPlaylist } from '@redux/features/player/palyerSlice.interface'
import { EmptyMusicCover } from '@styles/EmptyImage'
import React from 'react'
import { FaPlay } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const MusicItem = styled.li`
  display: flex;
  align-items: center;
  padding: 7px 0;
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border1};
  }

  & .musicItem-imgBox {
    width: 30px;
    height: 30px;

    & .link,
    & .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  & .musicItem-info {
    width: 100%;
    display: flex;
    align-items: center;

    & .index {
      margin: 0 10px;
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
      font-size: 12px;

      & .icon.play {
        font-size: 10px;
        margin-right: 5px;
      }
    }
  }
`

interface PlaylistMusicsProps {
  playlist: IPlaylist
}

const PlaylistMusics = ({ playlist }: PlaylistMusicsProps) => {
  return (
    <>
      {playlist.musics ? (
        <div>
          <ul>
            {playlist.musics.map((music, index) => (
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
                  <div className="index">{index}</div>
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
          </ul>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default PlaylistMusics
