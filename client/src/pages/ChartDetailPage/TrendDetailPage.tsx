import { genreList } from '@assets/data/genre'
import React, { useLayoutEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'
import ChartDetailPage from './ChartDetailPage'

const TrendDetailPage = () => {
  const navigate = useNavigate()
  const { genre } = useParams()

  const [title, setTitle] = useState<string>('')

  useLayoutEffect(() => {
    if (!genre) {
      navigate('/')
    } else if (genre === 'all') {
      setTitle('All music genres')
    } else {
      const find = genreList.find(
        (list) =>
          list.keywords.findIndex((keyward) =>
            genre?.toLowerCase().includes(keyward)
          ) !== -1
      )
      if (!find) {
        navigate('/')
      } else {
        setTitle(find.label)
      }
    }
  }, [genre, navigate])

  return (
    <>
      <Helmet>
        <title>{`Trending Tracks : ${title}`}</title>
      </Helmet>
      <ChartDetailPage
        title={title}
        description={`Trending ${title.toLowerCase()} tracks on Wave`}
        genre={genre === 'all' ? undefined : title}
        chart="trend"
      />
    </>
  )
}

export default TrendDetailPage
