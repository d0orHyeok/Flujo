import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import * as S from './TrendPage.style'
import { IMusic } from '@appTypes/music.type'
import { getTrendingMusics } from '@api/musicApi'
import SmallCardSlider from '@components/SmallCardSlider/SmallCardSlider'
import { Link } from 'react-router-dom'
import LoadingArea from '@components/Loading/LoadingArea'
import { genreChart, genreList } from '@assets/data/genre'
import CheckBox from '@components/Common/Checkbox'
import { Collapse } from '@mui/material'

interface IChart {
  title: string
  genre?: string
  musics: IMusic[]
}

const TrendPage = () => {
  const [expanded, setExpanded] = useState(false)
  const [genreCheck, setGenreCheck] = useState(
    Array.from({ length: genreList.length }, () => true)
  )
  const [page, setPage] = useState(0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const [charts, setCharts] = useState<IChart[]>([
    { title: 'All music genres', musics: [] },
  ])

  const toggleExpanded = useCallback(() => {
    setExpanded((state) => !state)
  }, [])

  const handleClickCheckbox = useCallback(
    (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setGenreCheck((state) =>
        state.map((bol, i) => (i === index ? !bol : bol))
      )
    },
    []
  )

  const handleGetChartedTracks = useCallback(async (genre?: string) => {
    try {
      const response = await getTrendingMusics(genre)
      const getItems = response.data
      return getItems
    } catch (error) {
      console.error(error)
      return []
    }
  }, [])

  const getGenreChartedMusics = useCallback(async () => {
    // 페이지 하단에 도달했을 때 장르별 차트목록을 불러온다
    if (done) {
      return
    }

    const getNum = 4
    const baseIndex = charts.length - 1

    // 장르종류를 가져온다
    const genres = genreChart.filter(
      (_, index) => index >= baseIndex && index < baseIndex + getNum
    )
    if (!genres || genres.length === 0) {
      setDone(true)
      return
    }

    setLoading(true)
    try {
      // 서버로 부터 장르들을 가져온다.
      const newCharts = await Promise.all(
        genres.map(async (genre) => {
          const musics: IMusic[] = await handleGetChartedTracks(genre)
          return { title: genre, genre, musics }
        })
      )
      setCharts((prevState) => [...prevState, ...newCharts])
    } catch (error: any) {
      setDone(true)
      console.error(error.response || error)
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [charts.length, done, page])

  const handleOnView = useCallback(
    (inView: boolean) => {
      if (inView && !loading && !done) {
        setPage((prevState) => prevState + 1)
      }
    },
    [loading, done]
  )

  useEffect(() => {
    // 첫 마운트에 전체 장르에대한 차트를 가져온다
    handleGetChartedTracks().then((musics) =>
      setCharts((prevState) =>
        prevState.map((chart) => {
          if (!chart.genre) {
            return { ...chart, musics }
          } else {
            return chart
          }
        })
      )
    )
  }, [handleGetChartedTracks])

  useEffect(() => {
    getGenreChartedMusics()
  }, [getGenreChartedMusics])

  return (
    <>
      <Helmet>
        <title>Trending tracks | Wave</title>
      </Helmet>
      <S.Container>
        <S.Head>
          <h1 className="title">Trending tracks</h1>
          <p className="description">
            The most played tracks on Wave this week
          </p>
        </S.Head>
        <S.FilterBox>
          <S.FilterBtn active={expanded} onClick={toggleExpanded}>
            Genre Filter
          </S.FilterBtn>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
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
        <ul>
          {charts.map((chart, index) => {
            if (!chart.musics.length) {
              // 차트에 음악이 없다면 넘어간다
              return <></>
            }

            // 장르필터에 체크된 항목만 보여지도록 한다
            const findIndex = genreList.findIndex(
              (item) => item.label === chart.genre
            )
            if (findIndex !== -1 && !genreCheck[findIndex]) {
              return <></>
            }

            return (
              <S.ChartItem key={index}>
                <h2 className="chart-title">
                  <Link to={`/sets/${chart.genre ? chart.genre : 'All'}`}>
                    {chart.title}
                  </Link>
                </h2>
                <SmallCardSlider musics={chart.musics} />
              </S.ChartItem>
            )
          })}
        </ul>
        {done ? (
          <></>
        ) : (
          <LoadingArea loading={loading} onInView={handleOnView} />
        )}
      </S.Container>
    </>
  )
}

export default TrendPage
