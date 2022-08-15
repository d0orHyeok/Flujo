import { getPlaylistsByTag } from '@api/playlistApi'
import { IPlaylist } from '@appTypes/playlist.type'
import LoadingArea from '@components/Loading/LoadingArea'
import PlaylistCard from '@components/PlaylistCard/PlaylistCard'
import { useAppSelector } from '@redux/hook'
import React, { useCallback, useEffect, useState } from 'react'

interface ITagPlaylistsProps {
  tag: string
}

const TagPlaylists = ({ tag }: ITagPlaylistsProps) => {
  const uid = useAppSelector((state) => state.user.userData?.id)

  const [playlists, setPlaylists] = useState<IPlaylist[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleOnView = useCallback(
    (inView: boolean) => {
      if (inView && !loading && !done) {
        setPage((prevState) => prevState + 1)
      }
    },
    [loading, done]
  )

  const getTaggedPlaylist = useCallback(async () => {
    setLoading(true)
    try {
      const getNum = 15
      const skip = page * getNum
      const take = skip + getNum
      const response = await getPlaylistsByTag(tag, { skip, take, uid })
      const getItems = response.data
      console.log(getItems)
      if (!getItems || getItems.length < getNum) {
        setDone(true)
      }
      setPlaylists((state) => [...state, ...getItems])
    } catch (error: any) {
      console.error(error)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }, [page, tag, uid])

  useEffect(() => {
    getTaggedPlaylist()
  }, [getTaggedPlaylist])

  return playlists.length || !done ? (
    <>
      {playlists.map((playlist, index) => (
        <PlaylistCard key={index} playlist={playlist} />
      ))}
      <LoadingArea loading={loading} hide={done} onInView={handleOnView} />
    </>
  ) : (
    <div>{`No playlists found for ${tag}`}</div>
  )
}

export default TagPlaylists
