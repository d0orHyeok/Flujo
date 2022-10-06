import { getPlaylistByPermalink } from '@api/playlistApi'
import InteractionBar from '@components/InteractionBar/InteractionBar'
import Loading from '@components/Loading/Loading'
import RelatedTarget, {
  RelatedTargetHandler,
} from '@components/RelatedTarget/RelatedTarget'
import UserContentCard from '@components/UserCard/UserContentCard'
import { IPlaylist } from '@appTypes/types.type.'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import PlaylistHead from './PlaylistHead/PlaylistHead'
import * as PageStyle from '@styles/TargetPageStyle/TargetPage.style'
import PlaylistMusics from './PlaylistMusics/PlaylistMusics'
import { Helmet } from 'react-helmet-async'
import { useSetMinWidth } from '@redux/context/appThemeProvider'

const PlaylistPage = () => {
  const setMinWidth = useSetMinWidth()
  const { userId, permalink } = useParams()
  const navigate = useNavigate()

  const [playlist, setPlaylist] = useState<IPlaylist | null>(null)
  const [existRelated, setExistRelated] = useState(false)

  const relatedTargetRef = useRef<RelatedTargetHandler>(null)
  const sideRef = useRef<HTMLDivElement>(null)

  const getPlaylistDataFromServer = useCallback(async () => {
    if (!userId || !permalink) {
      navigate('/playlist/notfound')
      return
    }

    try {
      const response = await getPlaylistByPermalink(userId, permalink)
      setPlaylist(response.data)
    } catch (error: any) {
      console.error(error.response || error)
      navigate('/playlist/notfound')
    }
  }, [navigate, permalink, userId])

  useLayoutEffect(() => {
    getPlaylistDataFromServer()
  }, [getPlaylistDataFromServer])

  useLayoutEffect(() => {
    if (
      playlist?.likesCount ||
      playlist?.repostsCount ||
      (playlist?.user && playlist.user.playlistsCount > 1)
    ) {
      setExistRelated(true)
    } else {
      setExistRelated(false)
    }
  }, [playlist])

  const resizeSideContent = useCallback(() => {
    if (sideRef.current) {
      const docH = document.body.offsetHeight
      const sideH = sideRef.current.getBoundingClientRect().height
      const calcH = Math.floor(docH - sideH - 101)
      sideRef.current.style.top = `${calcH < 81 ? calcH : 75}px`
    }
  }, [])

  useEffect(() => {
    resizeSideContent()
    window.addEventListener('resize', resizeSideContent)
    return () => {
      window.removeEventListener('resize', resizeSideContent)
    }
  }, [resizeSideContent])

  useEffect(() => {
    setMinWidth('725px')
    return () => {
      setMinWidth()
    }
  }, [setMinWidth])

  return !playlist ? (
    <Loading />
  ) : (
    <>
      <Helmet>
        <title>{`${playlist.name} by ${
          playlist.user.nickname || playlist.user.username
        }  | Wave`}</title>
      </Helmet>
      <PageStyle.Wrapper>
        <PlaylistHead playlist={playlist} />
        <PageStyle.Toolbox>
          <InteractionBar
            className="interaction"
            target={playlist}
            setTarget={setPlaylist}
          />
          <PageStyle.StyledDivider />
        </PageStyle.Toolbox>
        <PageStyle.Container>
          <PageStyle.Content
            border={existRelated}
            media={existRelated ? 1000 : undefined}
          >
            <UserContentCard
              className="content-uploader"
              user={playlist.user}
            />
            <PageStyle.MainContent className="maincontent">
              {playlist.description?.trim().length || playlist.tags?.length ? (
                <PageStyle.StyledDivider
                  className="media-divider"
                  sx={{ margin: '20px 0' }}
                />
              ) : (
                <></>
              )}
              <div className="content-info content-description">
                {playlist.description}
              </div>
              {playlist.tags ? (
                <ul className="content-info content-tags">
                  {playlist.tags.map((tag, index) => (
                    <li key={index} className="content-tags-item">
                      <Link to={`/tags/${tag}`}>{`#${tag}`}</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <></>
              )}
              {playlist.musics?.length ? (
                <PlaylistMusics musics={playlist.musics} />
              ) : (
                <></>
              )}
            </PageStyle.MainContent>
          </PageStyle.Content>
          {existRelated ? (
            <PageStyle.SideContent ref={sideRef} className="sidecontent">
              <RelatedTarget ref={relatedTargetRef} target={playlist} />
            </PageStyle.SideContent>
          ) : (
            <></>
          )}
        </PageStyle.Container>
      </PageStyle.Wrapper>
    </>
  )
}

export default PlaylistPage
