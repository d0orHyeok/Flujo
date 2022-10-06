import { clearHistory, getUsersHistorys } from '@api/historyApi'
import { IHistory } from '@appTypes/history.type'
import { Button } from '@components/Common'
import LoadingArea from '@components/Loading/LoadingArea'
import MusicCard from '@components/MusicCard/MusicCard'
import { Portal } from '@mui/material'
import { useSetMinWidth } from '@redux/context/appThemeProvider'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { BsClockHistory } from 'react-icons/bs'
import * as S from './HistoryPage.style'

const HistoryPage = () => {
  const setMinWidth = useSetMinWidth()

  const [historys, setHistorys] = useState<IHistory[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const [items, setItems] = useState<IHistory[]>([])
  const [filter, setFilter] = useState('')
  const [open, setOpen] = useState(false)

  const container = useRef(null)

  const handleClickClear = useCallback(async () => {
    try {
      await clearHistory()
    } catch (error) {
      console.error(error)
      alert('Fail to clear history.\n Please try again')
    } finally {
      setHistorys([])
      setPage(0)
      setLoading(false)
      setDone(false)
    }
  }, [])

  const whenFilterChange = useCallback(() => {
    if (filter.length === 0) {
      setItems(historys)
    } else {
      const match = filter.toLowerCase()

      const filterd = historys.filter((history) => {
        const { music } = history

        const result =
          music.title.toLowerCase().includes(match) ||
          music.user.nickname?.toLowerCase().includes(match) ||
          false

        console.log(result)

        return result
      })
      setItems(filterd)
    }
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
      const take = skip + getNum
      const response = await getUsersHistorys({ params: { skip, take } })
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
    setMinWidth('650px')
    return () => {
      setMinWidth()
    }
  }, [setMinWidth])

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
            <Button
              className="filterBox-clearBtn"
              onClick={() => setOpen(true)}
            >
              Clear all history
            </Button>
            <input
              className="filterBox-textfield"
              type="text"
              placeholder="Filter"
              value={filter}
              onChange={(e) => setFilter(e.currentTarget.value)}
            />
            {open && (
              <Portal container={container.current}>
                <S.MessageBox style={{ display: true ? 'block' : 'none' }}>
                  <div className="message">
                    {`Are you sure you want to clear your entire listening history? You won’t be able to undo this action.`}
                  </div>
                  <div className="buttonGroup">
                    <Button
                      className="messageBox-cancelBtn"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="messageBox-clearBtn"
                      onClick={handleClickClear}
                    >
                      Clear
                    </Button>
                  </div>
                </S.MessageBox>
              </Portal>
            )}
            <div ref={container}></div>
          </div>
          {items.map((history, index) => (
            <MusicCard key={index} music={history.music} />
          ))}
          {done && !historys.length ? (
            <S.NoHistory>
              <BsClockHistory className="icon" />
              <div className="text">You have no listening history yet.</div>
            </S.NoHistory>
          ) : (
            <></>
          )}
          <LoadingArea loading={loading} hide={done} onInView={handleOnView} />
        </S.Container>
      </S.Wrapper>
    </>
  )
}

export default HistoryPage
