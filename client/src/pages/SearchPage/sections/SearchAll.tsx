import React, { useCallback, useEffect, useState } from 'react'
import NoSearchResult from './NoSearchResult'
import LoadingArea from '@components/Loading/LoadingArea'
import { IUser } from '@appTypes/user.type'
import UserCard from '@components/UserCard/UserCard'
import { IMusic } from '@appTypes/music.type'
import { IPlaylist } from '@appTypes/playlist.type'
import MusicCard from '@components/MusicCard/MusicCard'
import PlaylistCard from '@components/PlaylistCard/PlaylistCard'
import Axios from '@api/Axios'
import { useAppSelector } from '@redux/hook'

interface ISearchAllProps {
  keyward: string
}

const SearchAll = ({ keyward }: ISearchAllProps) => {
  const uid = useAppSelector((state) => state.user.userData?.id)

  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [done, setDone] = useState(false)
  const [items, setItems] = useState<(IUser | IMusic | IPlaylist)[]>([])

  const handleOnView = useCallback(
    (inView: boolean) => {
      if (inView && !loading && Object.values(done).includes(false)) {
        setPage((prevState) => prevState + 1)
      }
    },
    [done, loading]
  )

  const getItems = useCallback(async () => {
    if (done || !keyward) return

    setLoading(true)
    try {
      const getNum = 8
      const skip = page * getNum
      const take = skip + getNum
      const res = await Axios.get(`/api/search/${keyward}`, {
        params: { skip, take, uid },
      })

      const getItems = res.data

      if (!getItems || getItems.length < getNum * 3) {
        setDone(true)
      }

      setItems((state) => [...state, ...getItems])
    } catch (error) {
      console.error(error)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }, [done, keyward, page, uid])

  useEffect(() => {
    getItems()
  }, [getItems])

  return items.length || !done ? (
    <div>
      {items.map((item, index) => {
        if ('profileImage' in item) {
          return <UserCard key={index} user={item} />
        }
        if ('title' in item) {
          return <MusicCard key={index} music={item} />
        }
        if ('name' in item) {
          return <PlaylistCard key={index} playlist={item} />
        }
      })}
      <LoadingArea loading={loading} hide={done} onInView={handleOnView} />
    </div>
  ) : (
    <NoSearchResult keyward={keyward} />
  )
}

export default SearchAll
