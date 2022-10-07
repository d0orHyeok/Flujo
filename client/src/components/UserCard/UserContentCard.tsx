import { numberFormat } from '@api/functions'
import { IUser } from '@appTypes/types.type.'
import { EmptyProfileImage } from '@styles/EmptyImage'
import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { BsSoundwave } from 'react-icons/bs'
import { IoMdPeople } from 'react-icons/io'
import { FollowTextButton } from '@components/Common/Button'
import { useAppSelector, useAuthDispatch } from '@redux/hook'
import { userToggleFollow } from '@redux/thunks/userThunks'

const Wrapper = styled.div`
  font-size: 16px;
  line-height: 16px;
  width: 140px;
  text-align: center;

  & .usercard-name {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const ImageBox = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto;
  margin-bottom: 10px;

  & .usercard-imageBox-link,
  & .usercard-imageBox-image {
    width: 100%;
    height: 100%;
    border-radius: 60px;
    object-fit: cover;
  }
`

const UserCountBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
  margin: 10px 0;

  & .usercard-count {
    font-size: 14px;
    line-height: 14px;
    &:hover {
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
    }

    & .icon {
      margin-right: 3px;
    }

    &.usercard-count-followers {
      margin-right: 10px;
    }
  }
`

const StyledFollowButton = styled(FollowTextButton)`
  border-radius: 4px;
  margin: 0 auto;
`

interface UserContentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  user: IUser
}

const UserContentCard = ({ user, ...props }: UserContentCardProps) => {
  const authDispatch = useAuthDispatch()

  const userData = useAppSelector((state) => state.user.userData)

  const handleClickFollow = useCallback(() => {
    authDispatch(userToggleFollow(user.id))
  }, [user.id, authDispatch])

  return (
    <Wrapper {...props}>
      <ImageBox>
        <Link to={`/profile/${user.id}`}>
          {user.profileImage ? (
            <img
              className="usercard-imageBox-image"
              src={user.profileImage}
              alt=""
            />
          ) : (
            <EmptyProfileImage className="usercard-imageBox-image" />
          )}
        </Link>
      </ImageBox>
      <div className="usercard-name">
        <Link to={`/profile/${user.id}`}>{user.nickname || user.username}</Link>
      </div>
      <UserCountBox>
        {user.followersCount > 0 ? (
          <div
            className="usercard-count usercard-count-followers"
            title={`${numberFormat(user.followersCount)} followers`}
          >
            <Link to={`/profile/${user.id}/followers`}>
              <IoMdPeople className="icon follwers" />
              {numberFormat(user.followersCount)}
            </Link>
          </div>
        ) : (
          <></>
        )}
        {user.musicsCount > 0 ? (
          <div
            className="usercard-count usercard-count-musics"
            title={`${numberFormat(user.musicsCount)} tracks`}
          >
            <Link to={`/profile/${user.id}/tracks`}>
              <BsSoundwave className="icon soundwave" />
              {numberFormat(user.musicsCount)}
            </Link>
          </div>
        ) : (
          <></>
        )}
      </UserCountBox>
      {userData?.id === user.id ? (
        <></>
      ) : (
        <StyledFollowButton
          isFollow={
            userData?.following &&
            userData?.following?.findIndex((f) => f.id === user.id) !== -1
          }
          onClick={handleClickFollow}
        />
      )}
    </Wrapper>
  )
}

export default UserContentCard
