import { findPlaylistsContainsMusic } from '@api/playlistApi'
import PlaylistCard from '@components/PlaylistCard/PlaylistCard'
import { IPlaylist } from '@appTypes/types.type.'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useInView } from 'react-intersection-observer'
import NoItem from './NoItem.style'
import LoadingArea from '@components/Loading/LoadingArea'

const StyledPlaylistCard = styled(PlaylistCard)`
  margin: 10px 0;
`

interface TrackDetailPlaylistsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  musicId: number
}

const TrackDetailPlaylists = ({
  musicId,
  ...props
}: TrackDetailPlaylistsProps) => {
  const { ref, inView } = useInView()

  const [playlists, setPlaylists] = useState<IPlaylist[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const getInPlaylsitItems = useCallback(async () => {
    if (done) {
      return
    }

    setLoading(true)
    try {
      const skip = page * 15
      const response = await findPlaylistsContainsMusic(
        musicId,
        skip,
        skip + 15
      )
      const getItems: IPlaylist[] = response.data
      if (!getItems || getItems.length < 15) {
        setDone(true)
      }
      setPlaylists((prevState) => [...prevState, ...getItems])
    } catch (error: any) {
      console.error(error.response || error)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }, [done, musicId, page])

  useEffect(() => {
    getInPlaylsitItems()
  }, [getInPlaylsitItems])

  useEffect(() => {
    if (inView && !loading && !done) {
      setPage((prevState) => prevState + 1)
    }
  }, [inView, loading, done])

  return (
    <>
      <div {...props}>
        {playlists.length ? (
          <>
            {playlists.map((playlist, index) => (
              <StyledPlaylistCard key={index} playlist={playlist} />
            ))}

            <LoadingArea ref={ref} loading={loading} hide={done} />
          </>
        ) : (
          <NoItem>
            Sorry...
            <br />
            {`There's no playlist`}
          </NoItem>
        )}
      </div>
    </>
  )
}

export default TrackDetailPlaylists
