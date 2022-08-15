import React, { useCallback, useEffect, useState } from 'react'
import { searchUser } from '@api/userApi'
import NoSearchResult from './NoSearchResult'
import LoadingArea from '@components/Loading/LoadingArea'
import { IUser } from '@appTypes/user.type'
import UserCard from '@components/UserCard/UserCard'

interface ISearchPeopleProps {
  keyward: string
}

const SearchPeople = ({ keyward }: ISearchPeopleProps) => {
  const [users, setUsers] = useState<IUser[]>([])
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

  const getUsersByKeyward = useCallback(async () => {
    if (!keyward || done) {
      return
    }

    setLoading(true)
    try {
      const getNum = 15
      const skip = page * getNum
      const take = skip + getNum
      const response = await searchUser(keyward, { skip, take })
      const getItems = response.data
      if (!getItems || getItems.length < getNum) {
        setDone(true)
      }
      setUsers((state) => [...state, ...getItems])
    } catch (error) {
      console.error(error)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }, [done, keyward, page])

  useEffect(() => {
    getUsersByKeyward()
  }, [getUsersByKeyward])

  return users.length || !done ? (
    <div>
      {users.map((user, index) => (
        <UserCard key={index} user={user} />
      ))}
      <LoadingArea loading={loading} hide={done} onInView={handleOnView} />
    </div>
  ) : (
    <NoSearchResult keyward={keyward} />
  )
}

export default SearchPeople
