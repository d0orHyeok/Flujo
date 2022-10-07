import { numberFormat } from '@api/functions'
import { FollowTextButton } from '@components/Common/Button'
import { IUser } from '@appTypes/types.type.'
import { useAppSelector, useAuthDispatch } from '@redux/hook'
import { EmptyProfileImage } from '@styles/EmptyImage'
import React, { useCallback, useLayoutEffect, useState } from 'react'
import { IoMdPeople } from 'react-icons/io'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import NoItem from './NoItem.style'
import LoadingArea from '@components/Loading/LoadingArea'
import { userToggleFollow } from '@redux/thunks/userThunks'

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

interface TrackDetailUsersPorps extends React.HTMLAttributes<HTMLUListElement> {
  users: IUser[]
  isLikes?: boolean
  isReposts?: boolean
}

const TrackDetailUsers = ({
  users,
  isLikes,
  isReposts,
  ...props
}: TrackDetailUsersPorps) => {
  const authDispatch = useAuthDispatch()

  const userId = useAppSelector((state) => state.user.userData?.id)
  const following =
    useAppSelector((state) => state.user.userData?.following) || []

  const [displayUsers, setDisplayUsers] = useState<IUser[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleClickFollow = useCallback(
    (id: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      authDispatch(userToggleFollow(id)).then((res) => {
        const type = res.payload?.type
        if (Boolean(type)) {
          const addCount = type === 'unfollow' ? -1 : 1
          setDisplayUsers((state) => {
            return state.map((f) =>
              f.id === id
                ? { ...f, followersCount: f.followersCount + addCount }
                : f
            )
          })
        }
      })
    },
    [authDispatch]
  )

  const getUserItems = useCallback(() => {
    const displayNum = 20

    if (done) {
      return
    }

    setLoading(true)

    const skip = page * displayNum
    const getItems = users.slice(skip, skip + displayNum)
    if (!getItems || getItems.length < displayNum) {
      setDone(true)
    }
    setDisplayUsers((prevState) => [...prevState, ...getItems])

    setLoading(false)
  }, [done, page, users])

  const handleOnView = useCallback(
    (inView: boolean) => {
      if (inView && !loading && !done) {
        setPage((prevState) => prevState + 1)
      }
    },
    [loading, done]
  )

  useLayoutEffect(() => {
    getUserItems()
  }, [getUserItems])

  return loading || users?.length ? (
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
    <NoItem>
      {`Thers's no ${isLikes ? 'like' : isReposts ? 'repost' : ''} user`}
    </NoItem>
  )
}

export default TrackDetailUsers
