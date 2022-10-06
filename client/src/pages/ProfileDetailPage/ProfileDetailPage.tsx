import * as S from './ProfileDetailPage.style'
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react'
import { IUser } from '@appTypes/user.type'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useAppSelector } from '@redux/hook'
import { getUserById } from '@api/userApi'
import Loading from '@components/Loading/Loading'
import CanNotFind from '@components/CanNotFind/CanNotFind'
import { EmptyProfileImage } from '@styles/EmptyImage'
import { Helmet } from 'react-helmet-async'
import { getCommentsByUserId } from '@api/commentApi'
import { IComment } from '@appTypes/comment.type'
import ProfileDetailLikes from './section/ProfileDetailLikes'
import ProfileDetailFollow from './section/ProfileDetailFollow'
import ProfileDetailComments from './section/ProfileDetailComments'
import { useInterval } from '@api/Hooks'

const ProfileDetailPage = () => {
  const { userId } = useParams()
  const location = useLocation()

  const userData = useAppSelector((state) => state.user.userData)
  const [isLoading, setIsLoading] = useState(false)
  const [profileData, setProfileData] = useState<IUser>()
  const [comments, setComments] = useState<IComment[]>([])
  const [nav, setNav] = useState(location.pathname.split('/').at(-1) || 'likes')
  const [displayText, setDisplayText] = useState<{
    title?: string
    head?: string
  }>({})

  const detailItems = useMemo(() => {
    const base = [
      { displayName: 'Likes', pathName: 'likes' },
      { displayName: 'Following', pathName: 'following' },
      { displayName: 'Followers', pathName: 'followers' },
    ]
    return !comments.length
      ? base
      : [...base, { displayName: 'Comments', pathName: 'comments' }]
  }, [comments])

  const getProfileData = useCallback(async () => {
    if (userId === 'you' || userData?.id === userId) {
      setProfileData(userData)
    } else {
      try {
        const response = await getUserById(userId || 'fail')
        setProfileData(response.data)
      } catch (error: any) {
        console.error(error.response || error)
        setProfileData(undefined)
      }
    }
  }, [userData, userId])

  const getComments = useCallback(async () => {
    if (!profileData?.id) {
      return
    }
    try {
      const response = await getCommentsByUserId(profileData.id)
      setComments(response.data)
    } catch (error) {
      console.error(error)
      setComments((prev) => prev)
    }
  }, [profileData?.id])

  const onLoad = useCallback(async () => {
    if (!profileData) {
      setIsLoading(true)
    }
    await getProfileData()
    setIsLoading(false)
  }, [getProfileData, profileData])

  const handleClickNavItem = useCallback(
    (link: string) => (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      window.history.pushState('', '', link)
      const newNav = link.split('/').at(-1)
      setNav(newNav || '')
    },
    []
  )

  const setTexts = useCallback(() => {
    if (!profileData) {
      return
    }

    const name = profileData.nickname || profileData.username

    switch (nav) {
      case 'likes':
        setDisplayText({
          title: `Liked tracks on Wave`,
          head: `Likes by ${name}`,
        })
        break
      case 'following':
        setDisplayText({
          title: `Who they follow on Wave`,
          head: `${name} is following`,
        })
        break
      case 'followers':
        setDisplayText({
          title: `${profileData.followersCount} followers on Wave`,
          head: `Followers of ${name}`,
        })
        break
      case 'comments':
        setDisplayText({
          title: `See comments by ${name} on Wave`,
          head: `Comments by ${name}`,
        })
        break
    }
  }, [nav, profileData])

  useLayoutEffect(() => {
    onLoad()
  }, [onLoad])

  useEffect(() => {
    getComments()
  }, [getComments])

  useEffect(() => {
    if (profileData) {
      setIsLoading(false)
    }
  }, [profileData])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [nav])

  useEffect(() => {
    setTexts()
  }, [setTexts])

  useInterval(getProfileData, 600000)

  return isLoading ? (
    <Loading />
  ) : !profileData ? (
    <CanNotFind text="user" />
  ) : (
    <>
      <Helmet>
        <title>
          {`${profileData.nickname || profileData.username} | ${
            displayText.title || 'Wave'
          }`}
        </title>
      </Helmet>
      <S.Wrapper>
        <S.Head>
          <div className="detail-imageBox">
            <Link
              className="detail-imageBox-link"
              to={`/profile/${profileData.id}`}
            >
              {profileData.profileImage ? (
                <img
                  className="detail-imageBox-img"
                  src={profileData.profileImage}
                  alt=""
                />
              ) : (
                <EmptyProfileImage className="detail-imageBox-img" />
              )}
            </Link>
          </div>
          <div className="detail-info">
            <div className="title">
              <Link
                className="detail-imageBox-link"
                to={`/profile/${profileData.id}`}
              >
                {displayText.head ||
                  profileData.nickname ||
                  profileData.username}
              </Link>
            </div>
          </div>
        </S.Head>

        {/* Navigation */}
        <S.NavUl>
          {detailItems.map((item, index) => {
            const link = `/profile/${profileData.id}/${item.pathName}`
            return (
              <li
                key={index}
                className={`detail-navItem${
                  nav === item.pathName ? ' select' : ''
                }`}
              >
                <Link
                  className="detail-navItem-link"
                  to={link}
                  onClick={handleClickNavItem(link)}
                >
                  {item.displayName}
                </Link>
              </li>
            )
          })}
        </S.NavUl>

        {/* Content */}
        <S.Content>
          {nav === 'likes' ? (
            <ProfileDetailLikes user={profileData} />
          ) : nav === 'following' || nav === 'followers' ? (
            <ProfileDetailFollow user={profileData} option={nav} />
          ) : nav === 'comments' && comments.length ? (
            <ProfileDetailComments comments={comments} />
          ) : (
            <></>
          )}
        </S.Content>
      </S.Wrapper>
    </>
  )
}

export default ProfileDetailPage
