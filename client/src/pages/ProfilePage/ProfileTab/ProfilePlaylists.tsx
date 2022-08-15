import { IPlaylist } from '@appTypes/types.type.'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import styled from 'styled-components'
import * as CommonStyle from './common.style'
import PlaylistCard from '@components/PlaylistCard/PlaylistCard'
import { AiOutlineMenu } from 'react-icons/ai'
import { getUserPlaylists } from '@api/playlistApi'
import LoadingArea from '@components/Loading/LoadingArea'
import { useAppSelector } from '@redux/hook'

const StyledPlaylistCard = styled(PlaylistCard)`
  &:not(:last-child) {
    margin-bottom: 10px;
  }
`

const StyledDivIcon = styled.div`
  padding: 30px;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.3)};
  border: 4px solid ${({ theme }) => theme.colors.bgTextRGBA(0.3)};
  border-radius: 8px;
  font-size: 100px;
`

interface ProfilePlaylistsProps extends React.HTMLAttributes<HTMLDivElement> {
  userId: string
}

const ProfilePlaylists = ({ userId, ...props }: ProfilePlaylistsProps) => {
  const uid = useAppSelector((state) => state.user.userData?.id)

  const [playlists, setPlaylists] = useState<IPlaylist[]>([])
  const [page, setPage] = useState(0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const getRelatedMusics = useCallback(async () => {
    const getNum = 15

    if (done) {
      return
    }

    setLoading(true)
    try {
      const skip = page * getNum
      const take = skip + getNum
      const response = await getUserPlaylists(userId, { skip, take, uid })
      const getItems: IPlaylist[] = response.data
      if (!getItems || getItems.length < getNum) {
        setDone(true)
      }
      setPlaylists((prevState) => [...prevState, ...getItems])
    } catch (error: any) {
      console.error(error.response || error)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }, [userId, done, page, uid])

  const handleOnView = useCallback(
    (inView: boolean) => {
      if (inView && !loading && !done) {
        setPage((prevState) => prevState + 1)
      }
    },
    [loading, done]
  )

  useLayoutEffect(() => {
    getRelatedMusics()
  }, [getRelatedMusics])

  return (
    <>
      {playlists.length ? (
        <div {...props}>
          {playlists.map((playlist, index) => (
            <StyledPlaylistCard
              key={index}
              playlist={playlist}
              buttonProps={{ mediaSize: 1200 }}
            />
          ))}
          <LoadingArea loading={loading} onInView={handleOnView} />
        </div>
      ) : (
        <CommonStyle.Empty>
          <StyledDivIcon>
            <AiOutlineMenu className="icon line" />
            {` +`}
          </StyledDivIcon>
          <div className="empty-content">
            You haven’t created any playlists.
          </div>
        </CommonStyle.Empty>
      )}
    </>
  )
}

export default ProfilePlaylists
