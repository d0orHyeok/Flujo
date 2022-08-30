import { numberFormat } from '@api/functions'
import { IUser } from '@appTypes/user.type'
import { FollowTextButton } from '@components/Common/Button'
import LoadingArea from '@components/Loading/LoadingArea'
import NoItem from '@pages/TrackDetailPage/DetailTab/NoItem.style'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { userToggleFollow } from '@redux/thunks/userThunks'
import { EmptyProfileImage } from '@styles/EmptyImage'
import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { IoMdPeople } from 'react-icons/io'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

const StyledUl = styled.ul`
  display: flex;
  flex-wrap: wrap;
`

const StyledLi = styled.li`
  padding: 15px;
  & .detailUsers-item-imageBox {
    width: 150px;
    height: 150px;
    & .detailusers-item-link,
    & .detailUsers-item-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  & .detailUsers-item-info {
    text-align: center;
    margin-top: 10px;
    font-size: 14px;

    & .followers {
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
      font-size: 12px;
      margin: 5px 0;
    }
  }

  & .followBtn {
    visibility: hidden;
  }

  &:hover {
    & .followBtn {
      visibility: visible;
    }
  }

  ${({ theme }) => theme.device.tablet} {
    & .detailUsers-item-imageBox {
      width: 120px;
      height: 120px;
    }
  }
`

const StyledFollowButton = styled(FollowTextButton)`
  border-radius: 4px;
`

interface IProfileDetailFollowProps
  extends React.HTMLAttributes<HTMLUListElement> {
  user: IUser
  option: 'following' | 'followers'
}

const ProfileDetailFollow = ({
  user,
  option,
  ...props
}: IProfileDetailFollowProps) => {
  const dispatch = useAppDispatch()

  const userId = useAppSelector((state) => state.user.userData?.id)
  const following =
    useAppSelector((state) => state.user.userData?.following) || []

  const [users, setUsers] = useState<IUser[]>([])
  const [displayUsers, setDisplayUsers] = useState<IUser[]>([])
  const [page, setPage] = useState(0)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleClickFollow = useCallback(
    (id: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      dispatch(userToggleFollow(id)).then((res: any) => {
        const { type } = res.payload
        const addCount = type === 'unfollow' ? -1 : 1

        setDisplayUsers((state) => {
          return state.map((f) =>
            f.id === id
              ? { ...f, followersCount: f.followersCount + addCount }
              : f
          )
        })
      })
    },
    [dispatch]
  )

  const getRelatedMusics = useCallback(async () => {
    if (done) {
      return
    }

    setLoading(true)
    try {
      const skip = page * 15
      const getItems = users.slice(skip, skip + 15)
      if (!getItems || getItems.length < 15) {
        setDone(true)
      }
      setDisplayUsers((prevState) => [...prevState, ...getItems])
    } catch (error: any) {
      console.error(error.response || error)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }, [done, users, page])

  const handleOnView = useCallback(
    (inView: boolean) => {
      if (inView && !loading && !done) {
        setPage((prevState) => prevState + 1)
      }
    },
    [loading, done]
  )

  useEffect(() => {
    setUsers(option === 'followers' ? user.followers : user.following)
    setPage(0)
    setDone(false)
    setDisplayUsers([])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option])

  useLayoutEffect(() => {
    getRelatedMusics()
  }, [getRelatedMusics])

  return users?.length ? (
    <StyledUl {...props}>
      {displayUsers.map((user, index) => (
        <StyledLi key={index}>
          <div className="detailUsers-item-imageBox">
            <Link className="detailUsers-item-link" to={`/profile/${user.id}`}>
              {user.profileImage ? (
                <img
                  className="detailUsers-item-img"
                  src={user.profileImage}
                  alt=""
                />
              ) : (
                <EmptyProfileImage className="detailUsers-item-img" />
              )}
            </Link>
          </div>
          <div className="detailUsers-item-info">
            <div className="name">
              <Link to={`/profile/${user.id}`}>
                {user.nickname || user.username}
              </Link>
            </div>
            <div
              className="followers"
              title={`${numberFormat(user.followersCount)} followers`}
              style={{
                visibility: user.followersCount ? 'visible' : 'hidden',
              }}
            >
              <IoMdPeople className="icon-followers" />
              {` ${numberFormat(user.followersCount)} followers`}
            </div>
            {userId !== user.id ? (
              <StyledFollowButton
                className="followBtn"
                isFollow={following.findIndex((f) => f.id === user.id) !== -1}
                onClick={handleClickFollow(user.id)}
              />
            ) : (
              <></>
            )}
          </div>
        </StyledLi>
      ))}
      <LoadingArea loading={loading} hide={done} onInView={handleOnView} />
    </StyledUl>
  ) : (
    <NoItem>{`'${
      user.nickname || user.username
    }' has no ${option} yet`}</NoItem>
  )
}

export default ProfileDetailFollow
