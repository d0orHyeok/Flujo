import { sortByCreatedAt } from '@api/functions'
import { getMusicsByIds } from '@api/musicApi'
import { getPlaylistsByIds } from '@api/playlistApi'
import { PrimaryButton } from '@components/Common/Button'
import LoadingArea from '@components/Loading/LoadingArea'
import MusicCard from '@components/MusicCard/MusicCard'
import PlaylistCard from '@components/PlaylistCard/PlaylistCard'
import { IUser, IPlaylist, IMusic } from '@appTypes/types.type.'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import * as CommonStyle from './common.style'
import { useAppSelector } from '@redux/hook'

const StyledDiv = styled.div`
  & .profileAll-item {
    &:not(:last-child) {
      margin-bottom: 10px;
    }
  }
`

interface ProfileAllProps extends React.HTMLAttributes<HTMLDivElement> {
  user: IUser
  editable?: boolean
}

const ProfileAll = ({ user, editable, ...props }: ProfileAllProps) => {
  const uid = useAppSelector((state) => state.user.userData?.id)

  const [items, setItems] = useState<any[]>(
    sortByCreatedAt([
      ...user.musics,
      ...user.playlists,
      ...user.repostMusics,
      ...user.repostPlaylists,
    ])
  )
  const [displayItems, setDisplayItems] = useState<(IMusic | IPlaylist)[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [done, setDone] = useState(false)

  const getItems = useCallback(async () => {
    if (done) {
      return
    }

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
      const res1 = await getMusicsByIds(musicIds, { uid })
      const res2 = await getPlaylistsByIds(playlistIds, { uid })
      const array = sortByCreatedAt([...res1.data, ...res2.data])
      setDisplayItems((prevState) => [...prevState, ...array])
    } catch (error: any) {
      setItems([])
      setDone(true)
      console.error(error.response || error)
    } finally {
      setLoading(false)
    }
  }, [done, items, page, uid])

  const handleOnView = useCallback(
    (inView: boolean) => {
      if (inView && !loading && !done) {
        setPage((prevState) => prevState + 1)
      }
    },
    [loading, done]
  )

  useEffect(() => {
    getItems()
  }, [getItems])

  return (
    <>
      {displayItems.length ? (
        <StyledDiv {...props}>
          {displayItems.map((item, index) => {
            if ('title' in item) {
              const repostUser =
                user.repostMusics.findIndex((rm) => rm.id === item.id) !== -1
                  ? user
                  : undefined

              return (
                <MusicCard
                  className="profileAll-item "
                  key={index}
                  music={item}
                  repostUser={repostUser}
                  buttonProps={{ mediaSize: 1200 }}
                />
              )
            } else {
              const repostUser =
                user.repostPlaylists.findIndex((rp) => rp.id === item.id) !== -1
                  ? user
                  : undefined

              return (
                <PlaylistCard
                  className="profileAll-item "
                  key={index}
                  playlist={item}
                  repostUser={repostUser}
                  buttonProps={{ mediaSize: 1200 }}
                />
              )
            }
          })}
          <LoadingArea loading={loading} onInView={handleOnView} />
        </StyledDiv>
      ) : (
        <CommonStyle.Empty>
          <CommonStyle.StyledEmptyTrackIcon />
          {editable ? (
            <>
              <div className="empty-content">
                Seems a little quiet over here
              </div>
              <div className="empty-link">
                <Link to={`/upload`}>
                  Upload a track to share it with your followers.
                </Link>
              </div>
              <PrimaryButton className="empty-button">
                <Link to={`/upload`}>Upload Now</Link>
              </PrimaryButton>
            </>
          ) : (
            <div className="empty-content">{`There's no tracks or playlists`}</div>
          )}
        </CommonStyle.Empty>
      )}
    </>
  )
}

export default ProfileAll
