import { findRelatedMusics } from '@api/musicApi'
import { IMusic } from '@appTypes/types.type.'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useInView } from 'react-intersection-observer'
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
  const { ref, inView } = useInView()

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
      const response = await findRelatedMusics(musicId, skip, skip + 15)
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

  useEffect(() => {
    getRelatedMusics()
  }, [getRelatedMusics])

  useEffect(() => {
    if (inView && !loading && !done) {
      setPage((prevState) => prevState + 1)
    }
  }, [inView, loading, done])

  return musics.length ? (
    <>
      <div {...props}>
        {musics.map((music, index) => (
          <StyledMusicCard key={index} music={music} />
        ))}
        <LoadingArea ref={ref} loading={loading} hide={done} />
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
