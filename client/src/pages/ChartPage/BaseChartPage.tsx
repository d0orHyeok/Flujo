import React, { useCallback, useEffect, useState } from 'react'
import * as S from './BaseChartPage.style'
import { IMusic } from '@appTypes/music.type'
import SmallCardSlider from '@components/SmallCardSlider/SmallCardSlider'
import { Link } from 'react-router-dom'
import LoadingArea from '@components/Loading/LoadingArea'
import { genreChart, genreList } from '@assets/data/genre'
import CheckBox from '@components/Common/Checkbox'
import { Collapse } from '@mui/material'
import Select, { Option } from '@components/Common/Select/Select'
import { getChartedMusics } from '@api/musicApi'
import axios, { Canceler } from 'axios'

interface IChart {
  title: string
  link: string
  genre?: string
  musics: IMusic[]
}

interface BaseChartPageProps {
  title: string
  description: string
  chart: 'trend' | 'newrelease'
}

const BaseChartPage = ({ title, description, chart }: BaseChartPageProps) => {
  const [period, setPeriod] = useState<string | number | undefined>('Weekly')
  const [expanded, setExpanded] = useState(false)
  const [genreCheck, setGenreCheck] = useState(
    Array.from({ length: genreList.length }, () => true)
  )
  const [page, setPage] = useState(-1)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(true)
  const [charts, setCharts] = useState<IChart[]>([])
  const [cancelers, setCancelers] = useState<Canceler[]>([])

  const toggleExpanded = useCallback(() => {
    setExpanded((state) => !state)
  }, [])

  const handleChagnePeriod = useCallback(
    (period?: string | number) => {
      setPeriod((prev) => {
        if (prev !== period) {
          cancelers.forEach((c) => c())
          setCancelers([])
          setCharts([])
          setPage(-1)
          return period
        } else {
          return prev
        }
      })
    },
    [cancelers]
  )

  const handleClickCheckbox = useCallback(
    (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setGenreCheck((state) =>
        state.map((bol, i) => (i === index ? !bol : bol))
      )
    },
    []
  )

  const handleGetChartedTracks = useCallback(
    async (genre?: string | string[]) => {
      setLoading(true)
      const date =
        period === 'Weekly' ? 'week' : period === 'Monthly' ? 'month' : period
      try {
        const cancelToken = new axios.CancelToken((c) =>
          setCancelers((prev) => [...prev, c])
        )
        const response = await getChartedMusics({
          cancelToken,
          params: {
            chart,
            genre,
            date,
          },
        })
        return response.data
      } catch (error) {
        if (!axios.isCancel(error)) {
          setDone(true)
        }
        console.error(error)
        return []
      }
    },
    [chart, period]
  )

  const getGenreChartedMusics = useCallback(async () => {
    // 페이지 하단에 도달했을 때 장르별 차트목록을 불러온다
    if (done || page < 0) {
      return
    }

    const getNum = 4
    const baseIndex = page * getNum

    // 장르종류를 가져온다
    const genres = genreChart.filter(
      (_, index) => index >= baseIndex && index < baseIndex + getNum
    )
    if (!genres || genres.length === 0) {
      setDone(true)
      return
    }

    try {
      // 서버로 부터 장르들을 가져온다.
      const genreMusics = await handleGetChartedTracks(genres)
      const newCharts = genreMusics?.map(
        (item: { genre: string; musics: IMusic[] }) => {
          const { genre, musics } = item
          const link = genre.toLowerCase().replace(/[^a-z]/g, '')
          return { title: genre, link: link, genre: genre, musics }
        }
      )
      setCharts((prevState) => [...prevState, ...newCharts])
      setLoading(false)
    } catch (error: any) {
      console.error(error.response || error)
    }
  }, [done, page, handleGetChartedTracks])

  const handleOnView = useCallback(
    (inView: boolean) => {
      if (inView && !loading && !done) {
        setPage((prevState) => {
          if (prevState < 0) {
            return prevState
          }
          const num = 4
          const itemNum = num * prevState + 1
          if (charts.length < itemNum) {
            return prevState
          }
          return prevState + 1
        })
      }
    },
    [charts.length, done, loading]
  )

  const getAllChart = useCallback(async () => {
    if (page === -1 && charts.length === 0) {
      setDone(false)
      const musics = await handleGetChartedTracks(undefined)
      if (musics.length === 0) {
        setDone(true)
      } else {
        setPage(0)
      }
      setCharts([{ title: 'All music genres', link: 'all', musics }])
    }
  }, [charts.length, handleGetChartedTracks, page])

  useEffect(() => {
    getGenreChartedMusics()
  }, [getGenreChartedMusics])

  useEffect(() => {
    getAllChart()
  }, [getAllChart])

  return (
    <>
      <S.Container>
        <S.Head>
          <h1 className="title">{title}</h1>
          <p className="description">{`${description} on Wave ${
            period === 'Daily'
              ? 'today'
              : period === 'Weekly'
              ? 'this week'
              : 'this month'
          }`}</p>
        </S.Head>
        <S.FilterBox>
          <h2 className="filterBox-title">Filter</h2>
          <Select
            className="filterBox-select"
            value={period}
            onChangeValue={handleChagnePeriod}
          >
            <div className="inner-select">
              <Option value="Daily">{'Daily'}</Option>
              <Option value="Weekly">{'Weekly'}</Option>
              <Option value="Monthly">{'Monthly'}</Option>
            </div>
          </Select>
          <S.FilterBtn
            className="filterBox-check"
            active={expanded}
            onClick={toggleExpanded}
          >
            Genre Filter
          </S.FilterBtn>
          <Collapse
            in={expanded}
            timeout="auto"
            unmountOnExit
            sx={{ marginTop: '8px' }}
          >
            <S.CheckboxContainer>
              {genreList.map((genre, index) => (
                <CheckBox
                  key={index}
                  label={genre.label}
                  checked={genreCheck[index]}
                  onClick={handleClickCheckbox(index)}
                />
              ))}
            </S.CheckboxContainer>
          </Collapse>
        </S.FilterBox>
        {charts.findIndex((chart) => chart.musics.length !== 0) !== -1 ||
        !done ? (
          <ul>
            {charts.map((chart, index) => {
              if (!chart.musics.length) {
                // 차트에 음악이 없다면 넘어간다
                return
              }

              // 장르필터에 체크된 항목만 보여지도록 한다
              const findIndex = genreList.findIndex(
                (item) => item.label === chart.genre
              )
              if (findIndex !== -1 && !genreCheck[findIndex]) {
                return
              }

              return (
                <S.ChartItem key={index}>
                  <h2 className="chart-title">
                    <Link
                      to={
                        chart.link +
                        `?date=${
                          period === 'Weekly'
                            ? 'week'
                            : period === 'Monthly'
                            ? 'month'
                            : period
                        }`
                      }
                    >
                      {chart.title}
                    </Link>
                  </h2>
                  <SmallCardSlider
                    cardsProps={chart.musics.map((music) => {
                      return { music }
                    })}
                  />
                </S.ChartItem>
              )
            })}
          </ul>
        ) : (
          <S.NoChart>
            {'Opps...'}
            <br />
            {`There's no ${title.toLowerCase()} tracks on this week`}
            <br />
            <br />
            <Link className="browse" to={'/'}>
              Browse tracks on Wave
            </Link>
          </S.NoChart>
        )}
        <LoadingArea loading={loading} hide={done} onInView={handleOnView} />
      </S.Container>
    </>
  )
}

export default BaseChartPage
