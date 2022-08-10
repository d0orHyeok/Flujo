import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import * as S from './TrendPage.style'
import { IMusic } from '@appTypes/music.type'
import { getTrendingMusics } from '@api/musicApi'

interface IChart {
  title: string
  genre?: string
  musics: IMusic[]
}

const TrendPage = () => {
  const [charts, setCharts] = useState<IChart[]>([
    { title: 'All music genres', musics: [] },
  ])

  const handleGetChartedTracks = useCallback(async (genre?: string) => {
    try {
      const response = await getTrendingMusics(genre)
      const getItems = response.data
      return getItems
      return getItems
    } catch (error) {
      console.error(error)
      return []
    }
  }, [])

  useEffect(() => {
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

  return (
    <>
      <Helmet>
        <title>Trending tracks | Wave</title>
      </Helmet>
      <S.Wrapper>
        <S.Container>
          <h2 className="chart-title">All music genres</h2>
          {charts[0].musics[0].title}
        </S.Container>
      </S.Wrapper>
    </>
  )
}

export default TrendPage
