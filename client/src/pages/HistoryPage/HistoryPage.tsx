import { getUsersHistorys } from '@api/historyApi'
import { IHistory } from '@appTypes/history.type'
import { Button } from '@components/Common'
import LoadingArea from '@components/Loading/LoadingArea'
import MusicCard from '@components/MusicCard/MusicCard'
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import * as S from './HistoryPage.style'

const HistoryPage = () => {
  const [historys, setHistorys] = useState<IHistory[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const [filter, setFilter] = useState('')
  const [filteredHistory, setFilteredHistory] = useState<IHistory[]>([])

  const whenFilterChange = useCallback(() => {
    if (filter.length === 0) {
      setFilteredHistory([])
      return
    }
    const match = filter.toLowerCase()

    const filterd = historys.filter((history) => {
      const { music } = history

      const result =
        music.title.toLowerCase().includes(match) ||
        music.user.nickname?.toLowerCase().includes(match)

      return result
    })
    setFilteredHistory(filterd)
  }, [filter, historys])

  const handleOnView = useCallback(
    (inView: boolean) => {
      if (inView && !loading && !done) {
        setPage((prevState) => prevState + 1)
      }
    },
    [loading, done]
  )

  const getHistorys = useCallback(async () => {
    setLoading(true)
    try {
      const getNum = 15
      const skip = page * getNum
      const response = await getUsersHistorys(skip, skip + getNum)
      const getItems = response.data
      if (!getItems || getItems.length < getNum) {
        setDone(true)
      }
      setHistorys((state) => [...state, ...getItems])
    } catch (error: any) {
      console.error(error)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    getHistorys()
  }, [getHistorys])

  useEffect(() => {
    whenFilterChange()
  }, [whenFilterChange])

  return (
    <>
      <Helmet>
        <title>{`Hear the sounds you've recently played | Wave`}</title>
      </Helmet>
      <S.Wrapper>
        <S.Container>
          <h1 className="title">{`Hear the tracks you’ve played:`}</h1>
          <S.StyledDivider />
          <div className="filterBox">
            <Button className="filterBox-clearBtn">Clear all history</Button>
            <input
              className="filterBox-textfield"
              type="text"
              placeholder="Filter"
              value={filter}
              onChange={(e) => setFilter(e.currentTarget.value)}
            />
          </div>
          {(filteredHistory.length ? filteredHistory : historys).map(
            (history, index) => (
              <MusicCard key={index} music={history.music} />
            )
          )}
          <LoadingArea loading={loading} hide={done} onInView={handleOnView} />
        </S.Container>
      </S.Wrapper>
    </>
  )
}

export default HistoryPage
