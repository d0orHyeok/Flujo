import { numberFormat } from '@api/functions'
import { IUser } from '@appTypes/user.type'
import { EmptyProfileImage } from '@styles/EmptyImage'
import React, { useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { IoMdPeople } from 'react-icons/io'
import { FollowTextButton } from '@components/Common/Button'
import { Link } from 'react-router-dom'
import { useAppSelector, useAuthDispatch } from '@redux/hook'
import { userToggleFollow } from '@redux/thunks/userThunks'

const Card = styled.div`
  padding: 10px 0;
  display: flex;
  align-items: center;

  & .userCard-imageBox {
    flex-shrink: 0;
    width: 160px;
    height: 160px;

    & .link,
    & .img {
      width: 100%;
      height: 100%;
      border-radius: 80px;
      object-fit: cover;
    }
  }

  & .userCard-info {
    margin-left: 10px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};

    & > *:not(:last-child) {
      margin-bottom: 10px;
    }

    & .userCard-info-name,
    & .userCard-info-follower {
      white-space: nowrap;
    }

    & .userCard-info-name,
    & .userCard-info-follower,
    & .userCard-info-description {
      text-overflow: ellipsis;
      overflow: hidden;
    }

    & .userCard-info-name {
      color: ${({ theme }) => theme.colors.bgText};
      font-size: 16px;
    }

    & .userCard-info-description {
      max-height: 60px;
    }

    & .userCard-info-follower {
      & a {
        display: flex;
        align-items: center;
        & .icon {
          margin-right: 6px;
          font-size: 16px;
        }
      }
    }
  }
`

const FollowBtn = styled(FollowTextButton)`
  border-radius: 3px;
  background-color: ${({ theme }) => theme.colors.bgColor};

  &:hover {
    border-color: ${({ theme }) => theme.colors.border2};
  }
`

interface UserCardProps extends React.HTMLAttributes<HTMLDivElement> {
  user: IUser
}

const UserCard = ({ user, ...props }: UserCardProps) => {
  const authDispatch = useAuthDispatch()

  const myId = useAppSelector((state) => state.user.userData?.id)
  const following = useAppSelector(
    (state) => state.user.userData?.following || []
  )
  const [isFollow, setIsFollow] = useState(false)
  const [followerCount, setFollowerCount] = useState(
    user.followersCount || user.followers.length || 0
  )

  const handleClickFollow = useCallback(
    (id: string) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      authDispatch(userToggleFollow(id)).then((res) => {
        const type = res.payload?.type
        if (Boolean(type)) {
          const add = type === 'unfollow' ? -1 : 1
          setFollowerCount((state) => state + add)
        }
      })
    },
    [authDispatch]
  )

  useEffect(() => {
    const newFollow = following.findIndex((f) => f.id === user.id) !== -1
    setIsFollow(newFollow)
  }, [following, user.id])

  return (
    <div {...props}>
      <Card>
        <div className="userCard-imageBox">
          <Link to={`/profile/${user.id}`}>
            {user.profileImage ? (
              <img className="img" src={user.profileImage} alt="" />
            ) : (
              <EmptyProfileImage className="img" />
            )}
          </Link>
        </div>
        <div className="userCard-info">
          <div className="userCard-info-name">
            <Link to={`/profile/${user.id}`}>
              {user.nickname || user.username}
            </Link>
          </div>
          {user.description ? (
            <div className="userCard-info-description">{user.description}</div>
          ) : (
            <></>
          )}
          <div
            title={`${numberFormat(followerCount)} followers`}
            className="userCard-info-follower"
          >
            <Link to={`/profile/${user.id}/followers`}>
              <IoMdPeople className="icon" />
              {`${numberFormat(followerCount)} followers`}
            </Link>
          </div>
          {user.id !== myId ? (
            <FollowBtn
              isFollow={isFollow}
              onClick={handleClickFollow(user.id)}
            />
          ) : (
            <></>
          )}
        </div>
      </Card>
    </div>
  )
}

export default UserCard
