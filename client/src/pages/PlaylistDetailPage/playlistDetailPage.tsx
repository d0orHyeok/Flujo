import { IPlaylist } from '@appTypes/types.type.'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import NotFoundPage from '@pages/NotFoundPage'
import styled from 'styled-components'
import { EmptyPlaylistImage } from '@styles/EmptyImage'
import Loading from '@components/Loading/Loading'
import TrackDetailUsers from '@pages/TrackDetailPage/DetailTab/TrackDetailUsers'
import { getPlaylistByPermalink } from '@api/playlistApi'

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

  & .playlistDetail-imageBox {
    flex-shrink: 0;
    width: 100px;
    height: 100px;
    margin-right: 20px;

    & .playlistDetail-imageBox-link,
    & .playlistDetail-imageBox-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  & .playlistDetail-info {
    & .title {
      font-size: 20px;
    }
  }
`

const NavUl = styled.ul`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border1};

  & .playlistDetail-navItem {
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
]

const PlaylistDetailPage = () => {
  const { userId, permalink, detail } = useParams()

  const [playlist, setPlaylist] = useState<IPlaylist>()
  const [isNotfound, setIsNotfound] = useState(false)
  const [title, setTitle] = useState<string | null>('')
  const [navIndex, setNavIndex] = useState(0)

  const getPlaylistData = useCallback(async () => {
    if (title === null || !userId || !permalink) {
      setIsNotfound(true)
      return
    }
    setIsNotfound(false)

    try {
      const response = await getPlaylistByPermalink(userId, permalink)
      setPlaylist(response.data)
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
    } else {
      setTitle(null)
    }
  }, [detail])

  useLayoutEffect(() => {
    getPlaylistData()
  }, [getPlaylistData])

  return isNotfound ? (
    <NotFoundPage />
  ) : !playlist ? (
    <Loading />
  ) : (
    <>
      <Helmet>
        <title>{`${title} ${playlist.name} by ${
          playlist.user.nickname || playlist.user.username
        } | Wave`}</title>
      </Helmet>
      <Wrapper>
        <Head>
          <div className="playlistDetail-imageBox">
            <Link
              className="playlistDetail-imageBox-link"
              to={`/playlist/${playlist.userId}/${playlist.permalink}`}
            >
              {playlist.image ? (
                <img
                  className="playlistDetail-imageBox-img"
                  src={playlist.image}
                  alt=""
                />
              ) : (
                <EmptyPlaylistImage className="playlistDetail-imageBox-img" />
              )}
            </Link>
          </div>
          <div className="playlistDetail-info">
            <div className="title">
              <Link
                className="playlistDetail-imageBox-link"
                to={`/playlist/${playlist.userId}/${playlist.permalink}`}
              >
                {playlist.name}
              </Link>
            </div>
          </div>
        </Head>

        {/* Navigation */}
        <NavUl>
          {detailItems.map((item, index) => {
            const link = `/playlist/${playlist.userId}/${playlist.permalink}/${item.pathName}`
            return (
              <li
                key={index}
                className={`playlistDetail-navItem${
                  navIndex === index ? ' select' : ''
                }`}
              >
                <Link
                  className="playlistDetail-navItem-link"
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
          <TrackDetailUsers
            {...(navIndex === 0
              ? { isLikes: true, users: playlist.likes || [] }
              : { isReposts: true, users: playlist.reposts || [] })}
          />
        </Content>
      </Wrapper>
    </>
  )
}

export default PlaylistDetailPage
