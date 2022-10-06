import { IMusic } from '@appTypes/types.type.'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import NotFoundPage from '@pages/NotFoundPage'
import styled from 'styled-components'
import { EmptyMusicCover } from '@styles/EmptyImage'
import TrackDetailUsers from './DetailTab/TrackDetailUsers'
import TrackDetailPlaylists from './DetailTab/TrackDetailPlaylists'
import Loading from '@components/Loading/Loading'
import { getMusicByPermalink } from '@api/musicApi'
import TrackDetailRelatedTracks from './DetailTab/TrackDetailRelatedTracks'
import { useInterval } from '@api/Hooks'

const Wrapper = styled.div`
  min-height: 100%;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 30px;
`

const Head = styled.div`
  display: flex;
  margin-bottom: 20px;

  & .trackDetail-imageBox {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    margin-right: 20px;

    & .trackDetail-imageBox-link,
    & .trackDetail-imageBox-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  & .trackDetail-info {
    & .title {
      font-size: 20px;
    }
  }
`

const NavUl = styled.ul`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border1};

  & .trackDetail-navItem {
    font-size: 18px;
    padding: 10px 0;
    border-bottom: 2px solid rgba(0, 0, 0, 0);

    ${({ theme }) => theme.device.tablet} {
      font-size: 14px;
    }

    &:not(:last-child) {
      margin-right: 15px;
    }

    &.select,
    &:hover {
      color: ${({ theme }) => theme.colors.primaryColor};
      border-color: ${({ theme }) => theme.colors.primaryColor};
    }
  }
`

const Content = styled.div``

const detailItems = [
  { displayName: 'Likes', pathName: 'likes' },
  { displayName: 'Reposts', pathName: 'reposts' },
  { displayName: 'In Playlists', pathName: 'in-playlists' },
  { displayName: 'Related Tracks', pathName: 'related-tracks' },
]

const TrackDetailPage = () => {
  const { userId, permalink, detail } = useParams()

  const [music, setMusic] = useState<IMusic>()
  const [isNotfound, setIsNotfound] = useState(false)
  const [title, setTitle] = useState<string | null>('')
  const [navIndex, setNavIndex] = useState(0)

  const getMusicData = useCallback(async () => {
    if (title === null || !userId || !permalink) {
      setIsNotfound(true)
      return
    }
    setIsNotfound(false)

    try {
      const response = await getMusicByPermalink(userId, permalink)
      setMusic(response.data)
    } catch (error: any) {
      setIsNotfound(true)
      console.error(error.response || error)
    }
  }, [permalink, title, userId])

  const handleClickNavItem = useCallback(
    (index: number, link: string) => (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()

      setNavIndex(index)
      window.history.pushState('', '', link)
    },
    []
  )

  useLayoutEffect(() => {
    if (detail === 'likes' || detail === 'reposts') {
      setTitle(`See all ${detail} of `)
      detail === 'likes' ? setNavIndex(0) : setNavIndex(1)
    } else if (detail === 'in-playlists') {
      setTitle('Listen to playlists featuring')
      setNavIndex(2)
    } else if (detail === 'related-tracks') {
      setTitle('Stream ')
      setNavIndex(3)
    } else {
      setTitle(null)
    }
  }, [detail])

  useLayoutEffect(() => {
    getMusicData()
  }, [getMusicData])

  useInterval(getMusicData, 600000)

  return isNotfound ? (
    <NotFoundPage />
  ) : !music ? (
    <Loading />
  ) : (
    <>
      <Helmet>
        <title>{`${title} ${music.title} by ${
          music.user.nickname || music.user.username
        } | Wave`}</title>
      </Helmet>
      <Wrapper>
        <Head>
          <div className="trackDetail-imageBox">
            <Link
              className="trackDetail-imageBox-link"
              to={`/track/${music.userId}/${music.permalink}`}
            >
              {music.cover ? (
                <img
                  className="trackDetail-imageBox-img"
                  src={music.cover}
                  alt=""
                />
              ) : (
                <EmptyMusicCover className="trackDetail-imageBox-img" />
              )}
            </Link>
          </div>
          <div className="trackDetail-info">
            <div className="title">
              <Link
                className="trackDetail-imageBox-link"
                to={`/track/${music.userId}/${music.permalink}`}
              >
                {music.title}
              </Link>
            </div>
          </div>
        </Head>

        {/* Navigation */}
        <NavUl>
          {detailItems.map((item, index) => {
            const link = `/track/${music.userId}/${music.permalink}/${item.pathName}`
            return (
              <li
                key={index}
                className={`trackDetail-navItem${
                  navIndex === index ? ' select' : ''
                }`}
              >
                <Link
                  className="trackDetail-navItem-link"
                  to={link}
                  onClick={handleClickNavItem(index, link)}
                >
                  {item.displayName}
                </Link>
              </li>
            )
          })}
        </NavUl>

        {/* Content */}
        <Content>
          {navIndex <= 1 ? (
            <TrackDetailUsers
              {...(navIndex === 0
                ? { isLikes: true, users: music.likes || [] }
                : { isReposts: true, users: music.reposts || [] })}
            />
          ) : navIndex === 2 ? (
            <TrackDetailPlaylists musicId={music.id} />
          ) : navIndex === 3 ? (
            <TrackDetailRelatedTracks musicId={music.id} />
          ) : (
            <></>
          )}
        </Content>
      </Wrapper>
    </>
  )
}

export default TrackDetailPage
