import React, { useEffect, useLayoutEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import * as S from './SearchPage.style'
import { Helmet } from 'react-helmet-async'
import SearchTracks from './sections/SearchTracks'
import SearchPlaylist from './sections/SearchPlaylists'
import SearchPeople from './sections/SearchPeople'
import SearchAll from './sections/SearchAll'
import { useSetMinWidth } from '@redux/context/appThemeProvider'

const SearchPage = () => {
  const location = useLocation()
  const setMinWidth = useSetMinWidth()

  const [keyward, setKeyward] = useState('')
  const [tab, setTab] = useState<string>('query')

  useLayoutEffect(() => {
    const [query, searchText] = location.search.split('?')[1].split('=')
    setTab(query || '')
    setKeyward(searchText || '')
  }, [location])

  useEffect(() => {
    setMinWidth('900px')
    return () => {
      setMinWidth()
    }
  }, [setMinWidth])

  return (
    <>
      <Helmet>
        <title>{`${keyward || 'Search'} results on Wave`}</title>
      </Helmet>
      <S.Wrapper>
        <S.Head className="head">{`Search results for "${keyward}"`}</S.Head>
        <S.StyledSearchSide
          className="side"
          query={tab}
          onQueryChange={setTab}
          keyward={keyward}
        />
        <S.Container>
          {tab === 'tracks' ? (
            <SearchTracks keyward={keyward} />
          ) : tab === 'playlists' ? (
            <SearchPlaylist keyward={keyward} />
          ) : tab === 'people' ? (
            <SearchPeople keyward={keyward} />
          ) : tab === 'query' ? (
            <SearchAll keyward={keyward} />
          ) : null}
        </S.Container>
      </S.Wrapper>
    </>
  )
}

export default React.memo(SearchPage)
