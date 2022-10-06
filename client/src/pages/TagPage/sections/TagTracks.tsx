import { getMusicsByTag } from '@api/musicApi'
import { IMusic } from '@appTypes/music.type'
import LoadingArea from '@components/Loading/LoadingArea'
import MusicCard from '@components/MusicCard/MusicCard'
import { useAppSelector } from '@redux/hook'
import React, { useCallback, useEffect, useState } from 'react'

interface ITagTracksProps {
  tag: string
}

const TagTracks = ({ tag }: ITagTracksProps) => {
  const uid = useAppSelector((state) => state.user.userData?.id)

  const [musics, setMusics] = useState<IMusic[]>([])
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

  const getTaggedMusic = useCallback(async () => {
    setLoading(true)
    try {
      const getNum = 15
      const skip = page * getNum
      const take = skip + getNum
      const response = await getMusicsByTag(tag, {
        params: { skip, take, uid },
      })
      const getItems = response.data
      if (!getItems || getItems.length < getNum) {
        setDone(true)
      }
      setMusics((state) => [...state, ...getItems])
    } catch (error: any) {
      console.error(error)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }, [page, tag, uid])

  useEffect(() => {
    getTaggedMusic()
  }, [getTaggedMusic])

  return musics.length || !done ? (
    <>
      {musics.map((music, index) => (
        <MusicCard key={index} music={music} />
      ))}
      <LoadingArea loading={loading} hide={done} onInView={handleOnView} />
    </>
  ) : (
    <div>{`No tracks found for ${tag}`}</div>
  )
}

export default TagTracks
