import { sortByCreatedAt } from '@api/functions'
import { getMusicsByIds } from '@api/musicApi'
import { getPlaylistsByIds } from '@api/playlistApi'
import MusicCard from '@components/MusicCard/MusicCard'
import PlaylistCard from '@components/PlaylistCard/PlaylistCard'
import { IUser, IPlaylist, IMusic } from '@appTypes/types.type.'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import * as CommonStyle from './common.style'
import { BiRepost } from 'react-icons/bi'
import LoadingArea from '@components/Loading/LoadingArea'

const StyledRepostIcon = styled(BiRepost)`
  padding: 30px 80px;
  font-size: 100px;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.33)};
  border: 4px solid ${({ theme }) => theme.colors.bgTextRGBA(0.33)};
  border-radius: 8px;
`

const StyledDiv = styled.div`
  & .profileReposts-item {
    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
`

interface ProfileRepostsProps extends React.HTMLAttributes<HTMLDivElement> {
  user: IUser
}

const ProfileReposts = ({ user, ...props }: ProfileRepostsProps) => {
  const [items, setItems] = useState(
    sortByCreatedAt([...user.repostMusics, ...user.repostPlaylists])
  )
  const [displayItems, setDisplayItems] = useState<(IMusic | IPlaylist)[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [done, setDone] = useState(false)

  const getItems = useCallback(async () => {
    if (done) {
      return
    }

    setLoading(true)

    const getNum = 15
    const skip = page * getNum
    const getItems = items.slice(skip, skip + getNum)
    if (!getItems || getItems.length < getNum) {
      setDone(true)
    }

    const playlistIds: number[] = []
    const musicIds: number[] = []
    getItems.forEach((item) =>
      'title' in item ? musicIds.push(item.id) : playlistIds.push(item.id)
    )

    try {
      const res1 = await getMusicsByIds(musicIds)
      const res2 = await getPlaylistsByIds(playlistIds)
      const array = sortByCreatedAt([...res1.data, ...res2.data])
      setDisplayItems((prevState) => [...prevState, ...array])
    } catch (error: any) {
      setItems([])
      console.error(error.response || error)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }, [done, items, page])

  const handleOnView = useCallback(
    (inView: boolean) => {
      if (inView && !loading && !done) {
        setPage((prevState) => prevState + 1)
      }
    },
    [loading, done]
  )

  const resetItem = useCallback(() => {
    let changed = false
    setItems((items) => {
      const newItems = sortByCreatedAt([
        ...user.repostMusics,
        ...user.repostPlaylists,
      ])

      if (
        items.length !== newItems.length ||
        items.findIndex((i, index) => i.id !== newItems[index].id) !== -1
      ) {
        changed = true
        return newItems
      }
      return items
    })

    if (changed) {
      setDisplayItems([])
      setPage(0)
      setDone(false)
    }
  }, [user])

  useEffect(() => {
    resetItem()
  }, [resetItem])

  useEffect(() => {
    getItems()
  }, [getItems])

  return (
    <>
      {items.length ? (
        <StyledDiv {...props}>
          {displayItems.map((item, index) =>
            'title' in item ? (
              <MusicCard
                className="profileReposts-item "
                key={index}
                music={item}
                repostUser={user}
                buttonProps={{ mediaSize: 1200 }}
              />
            ) : (
              <PlaylistCard
                className="profileReposts-item "
                key={index}
                playlist={item}
                repostUser={user}
                buttonProps={{ mediaSize: 1200 }}
              />
            )
          )}
          <LoadingArea
            loading={loading}
            onInView={handleOnView}
            hide={done && !loading}
          />
        </StyledDiv>
      ) : (
        <CommonStyle.Empty>
          <StyledRepostIcon />

          <div className="empty-content">
            {`You haven’t reposted any sounds.`}
          </div>
          <div className="empty-link">
            <Link to={`/home`}>{`Discover tracks & playlists`}</Link>
          </div>
        </CommonStyle.Empty>
      )}
    </>
  )
}

export default ProfileReposts
