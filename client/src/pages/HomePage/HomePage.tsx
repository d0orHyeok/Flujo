import { IMusic } from '@redux/features/player/palyerSlice.interface'
import * as S from './HomePage.style'
import React, { useEffect, useState } from 'react'
import MusicCard from '@components/MusicCard/MusicCard'
import { getAllMusic } from '@api/musicApi'
import { Helmet } from 'react-helmet'

// trending, recent_play, new, hot_playlist

const HomePage = () => {
  const [musics, setMusics] = useState<IMusic[]>([])

  useEffect(() => {
    getAllMusic()
      .then((res) => {
        setMusics(res.data)
      })
      .catch((err) => {
        console.log(err.response)
      })
  }, [])

  return (
    <>
      <Helmet>
        <title>Wave | Stream and share to music online</title>
      </Helmet>
      <S.Wrapper>
        <S.Container>
          <h1>Hellow</h1>
          <div>Hellow</div>
          {musics.map((music, index) => (
            <MusicCard key={index} music={music} />
          ))}
        </S.Container>
      </S.Wrapper>
    </>
  )
}

export default React.memo(HomePage)
