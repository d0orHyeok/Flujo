import { findRelatedMusics } from '@api/musicApi'
import { IMusic } from '@appTypes/types.type.'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import styled from 'styled-components'
import NoItem from './NoItem.style'
import MusicCard from '@components/MusicCard/MusicCard'
import LoadingArea from '@components/Loading/LoadingArea'

const StyledMusicCard = styled(MusicCard)`
  margin: 10px 0;
`

interface TrackDetailRelatedTracksProps
  extends React.HTMLAttributes<HTMLDivElement> {
  musicId: number
}

const TrackDetailRelatedTracks = ({
  musicId,
  ...props
}: TrackDetailRelatedTracksProps) => {
  const [musics, setMusics] = useState<IMusic[]>([])
  const [page, setPage] = useState(0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const getRelatedMusics = useCallback(async () => {
    if (done) {
      return
    }

    setLoading(true)
    try {
      const skip = page * 15
      const take = skip + 15
      const response = await findRelatedMusics(musicId, { skip, take })
      const getItems: IMusic[] = response.data
      if (!getItems || getItems.length < 15) {
        setDone(true)
      }
      setMusics((prevState) => [...prevState, ...getItems])
    } catch (error: any) {
      console.error(error.response || error)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }, [done, musicId, page])

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

  return musics.length ? (
    <>
      <div {...props}>
        {musics.map((music, index) => (
          <StyledMusicCard key={index} music={music} />
        ))}
        <LoadingArea loading={loading} hide={done} onInView={handleOnView} />
      </div>
    </>
  ) : (
    <NoItem>
      Sorry...
      <br />
      {`There's no related tracks`}
    </NoItem>
  )
}

export default TrackDetailRelatedTracks
