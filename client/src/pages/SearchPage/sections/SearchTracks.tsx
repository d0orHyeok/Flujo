import React, { useCallback, useEffect, useState } from 'react'
import { searchMusic } from '@api/musicApi'
import { IMusic } from '@appTypes/music.type'
import MusicCard from '@components/MusicCard/MusicCard'
import NoSearchResult from './NoSearchResult'
import LoadingArea from '@components/Loading/LoadingArea'
import { useAppSelector } from '@redux/hook'

interface ISearchTracksProps {
  keyward: string
}

const SearchTracks = ({ keyward }: ISearchTracksProps) => {
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

  const getMusicByKeyward = useCallback(async () => {
    if (!keyward || done) {
      return
    }

    setLoading(true)
    try {
      const getNum = 15
      const skip = page * getNum
      const take = skip + getNum
      const response = await searchMusic(keyward, {
        params: { skip, take, uid },
      })
      const getItems = response.data
      if (!getItems || getItems.length < getNum) {
        setDone(true)
      }
      setMusics((state) => [...state, ...getItems])
    } catch (error) {
      console.error(error)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }, [done, keyward, page, uid])

  useEffect(() => {
    getMusicByKeyward()
  }, [getMusicByKeyward])

  return musics.length || !done ? (
    <div>
      {musics.map((music, index) => (
        <MusicCard key={index} music={music} />
      ))}
      <LoadingArea loading={loading} hide={done} onInView={handleOnView} />
    </div>
  ) : (
    <NoSearchResult keyward={keyward} />
  )
}

export default SearchTracks
