import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import TagTracks from './sections/TagTracks'
import { Helmet } from 'react-helmet-async'
import * as S from './TagPage.style'
import { RiCheckboxMultipleBlankFill } from 'react-icons/ri'
import { BsSoundwave } from 'react-icons/bs'
import TagPlaylists from './sections/TagPlaylists'
import { useSetMinWidth } from '@redux/context/appThemeProvider'

const navItems = [
  { text: 'Tracks', icon: <BsSoundwave className="icon" /> },
  {
    path: 'playlists',
    text: 'Playlists',
    icon: <RiCheckboxMultipleBlankFill className="icon" />,
  },
]

const TagPage = () => {
  const { tag, nav: paramNav } = useParams()
  const navigate = useNavigate()
  const setMinWidth = useSetMinWidth()

  const [title, setTitle] = useState(`New tracks tagged #${tag}`)
  const [nav, setNav] = useState(paramNav)

  const handleClickNav = useCallback(
    (link: string) => (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()

      window.history.pushState('', '', link)
      const linkArr = link.split('/')
      const newNav = linkArr.length < 4 ? undefined : linkArr.at(-1)
      setNav(newNav)
    },
    []
  )

  useLayoutEffect(() => {
    if (!nav || nav === 'tracks') {
      setTitle(`New tracks tagged #${tag}`)
    } else if (nav === 'playlists') {
      setTitle(`Playlists tagged #${tag}`)
    } else {
      navigate(`/tag/${tag}%2F${nav}`)
    }
  }, [nav, navigate, tag])

  useEffect(() => {
    setMinWidth('650px')
    return () => {
      setMinWidth()
    }
  }, [setMinWidth])

  return (
    <>
      <Helmet>
        <title>{`Music tracks, playlists tagged ${tag} | Wave`}</title>
      </Helmet>
      <S.Wrapper>
        <S.Head>{title}</S.Head>
        <S.Navbar>
          <ul>
            {navItems.map((item, index) => {
              const link = `/tags/${tag}${item.path ? `/${item.path}` : ''}`
              return (
                <li key={index} className={nav === item.path ? 'select' : ''}>
                  <Link to={link} onClick={handleClickNav(link)}>
                    {item.icon}
                    <span className="text">{item.text}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </S.Navbar>
        <S.Container>
          {!nav || nav === 'tracks' ? (
            <TagTracks tag={tag || ''} />
          ) : nav === 'playlists' ? (
            <TagPlaylists tag={tag || ''} />
          ) : (
            <></>
          )}
        </S.Container>
      </S.Wrapper>
    </>
  )
}

export default TagPage
