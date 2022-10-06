import { IUser } from '@appTypes/types.type.'
import { useAppSelector } from '@redux/hook'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useParams } from 'react-router-dom'
import * as S from './ProfilePage.style'
import CanNotFind from '../../components/CanNotFind/CanNotFind'
import Loading from '@components/Loading/Loading'
import ProfileHead from './ProfileHead/ProfileHead'
import ProfileNav from './ProfileNav/ProfileNav'
import { getUserById } from '@api/userApi'
import { Helmet } from 'react-helmet-async'
import ProfileAll from './ProfileTab/ProfileAll'
import ProfilePopularTracks from './ProfileTab/ProfilePopularTracks'
import ProfileTracks from './ProfileTab/ProfileTracks'
import ProfilePlaylists from './ProfileTab/ProfilePlaylists'
import ProfileReposts from './ProfileTab/ProfileReposts'
import ProfileSide from './ProfileSide/ProfileSide'
import { useInterval } from '@api/Hooks'
import { useSetMinWidth } from '@redux/context/appThemeProvider'

const ProfilePage = () => {
  const setMinWidth = useSetMinWidth()
  const { userId, nav: paramNav } = useParams()

  const userData = useAppSelector((state) => state.user.userData)

  const [isLoading, setIsLoading] = useState(false)
  const [editable, setEditable] = useState(false)
  const [profileData, setProfileData] = useState<IUser>()
  const [nav, setNav] = useState(paramNav)

  const sideRef = useRef<HTMLDivElement>(null)

  const getProfileData = useCallback(async () => {
    if (userId === 'you' || userData?.id === userId) {
      setProfileData(userData)
    } else {
      try {
        const response = await getUserById(userId || 'fail')
        setProfileData(response.data)
      } catch (error: any) {
        console.error(error.response || error)
      }
    }
  }, [userData, userId])

  const applyDataChanged = useCallback(() => {
    if (userId === 'you' || userData?.id === userId) {
      setProfileData(userData)
    }
  }, [userData, userId])

  const onLoad = useCallback(async () => {
    if (!profileData) {
      setIsLoading(true)
    }
    await getProfileData()
    setIsLoading(false)
  }, [getProfileData, profileData])

  useLayoutEffect(() => {
    onLoad()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    applyDataChanged()
  }, [applyDataChanged])

  useEffect(() => {
    setEditable(userId === 'you' || userData?.id === userId)
  }, [userData, userId])

  useEffect(() => {
    if (profileData) {
      setIsLoading(false)
    }
  }, [profileData])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [nav])

  const resizeSideContent = useCallback(() => {
    if (!sideRef.current) return
    const docH = document.body.offsetHeight
    const sideH = sideRef.current.getBoundingClientRect().height
    const calcH = Math.floor(docH - sideH - 91)
    sideRef.current.style.top = `${calcH < 81 ? calcH : 65}px`

    const parent = sideRef.current.parentElement
    if (!parent) return
    const parentRect = parent.getBoundingClientRect()
    const minHeight = Math.floor(docH - parentRect.top - 81)
    if (minHeight > 0) {
      parent.style.minHeight = `${minHeight}px`
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav])

  useEffect(() => {
    window.addEventListener('resize', resizeSideContent)
    return () => {
      window.removeEventListener('resize', resizeSideContent)
    }
  }, [resizeSideContent])

  useEffect(() => {
    if (!isLoading) {
      resizeSideContent()
    }
  }, [isLoading, resizeSideContent])

  useInterval(getProfileData, 600000)

  useEffect(() => {
    setMinWidth('900px')
    return () => {
      setMinWidth()
    }
  }, [setMinWidth])

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : !profileData ? (
        <CanNotFind text="user" />
      ) : (
        <>
          <Helmet>
            <title>{`Profile ${
              profileData.nickname || profileData.username
            }  | Wave`}</title>
          </Helmet>
          <S.Wrapper>
            <ProfileHead user={profileData} />
            <ProfileNav
              className="profileNav"
              editable={editable}
              profileData={profileData}
              nav={nav}
              onNavChange={setNav}
            />
            <S.Container>
              <div className="profile-main">
                {!nav ? (
                  <ProfileAll user={profileData} editable={editable} />
                ) : nav === 'popular-tracks' ? (
                  <ProfilePopularTracks
                    user={profileData}
                    editable={editable}
                  />
                ) : nav === 'tracks' ? (
                  <ProfileTracks user={profileData} editable={editable} />
                ) : nav === 'playlists' ? (
                  <ProfilePlaylists user={profileData} />
                ) : nav === 'reposts' ? (
                  <ProfileReposts user={profileData} />
                ) : (
                  <></>
                )}
              </div>
              <div ref={sideRef} className="profile-side">
                <ProfileSide user={profileData} />
              </div>
            </S.Container>
          </S.Wrapper>
        </>
      )}
    </>
  )
}

export default React.memo(ProfilePage)
