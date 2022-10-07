import styled from 'styled-components'
import React, { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { EmptyProfileImage } from '@styles/EmptyImage'
import { IoMdPeople } from 'react-icons/io'
import { FollowTextButton } from '@components/Common/Button'
import { numberFormat } from '@api/functions'
import { useAppSelector, useAuthDispatch } from '@redux/hook'
import { userToggleFollow } from '@redux/thunks/userThunks'
import { IUser } from '@appTypes/types.type.'

const StyledDiv = styled.div`
  width: 160px;
  padding: 20px 0;

  display: flex;
  flex-direction: column;
  align-items: center;

  & .popover-imageBox {
    width: 80px;
    height: 80px;
    border-radius: 40px;

    & .popover-imageBox-img {
      width: 100%;
      height: 100%;
      border-radius: inherit;
      object-fit: cover;
    }
  }

  & .popover-user-name {
    margin-top: 10px;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
  }

  & .popover-user-followers {
    display: flex;
    align-items: center;
    margin-top: 5px;
    font-size: 12px;

    & .popover-icon {
      font-size: 16px;
      margin-right: 3px;
    }

    &:hover {
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
    }
  }
`

const StyledFollowBtn = styled(FollowTextButton)`
  border-radius: 4px;
  margin-top: 10px;
`

interface PopoverContentProps {
  user: IUser
}

const PopoverContent = ({ user }: PopoverContentProps) => {
  const authDispatch = useAuthDispatch()

  const userId = useAppSelector((state) => state.user.userData?.id)
  const following =
    useAppSelector((state) => state.user.userData?.following) || []

  const handleClickFollow = useCallback(
    (targetId: string) => (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()
      authDispatch(userToggleFollow(targetId))
    },
    [authDispatch]
  )

  return (
    <StyledDiv>
      <Link to={`/profile/${user.id}`}>
        <div className="popover-imageBox">
          {user.profileImage ? (
            <img
              className="popover-imageBox-img"
              src={user.profileImage}
              alt=""
            />
          ) : (
            <EmptyProfileImage className="popover-imageBox-img" />
          )}
        </div>
      </Link>
      <Link className="popover-user-name" to={`/profile/${user.id}`}>
        {user.nickname || user.username}
      </Link>
      {user.followersCount > 0 ? (
        <Link
          className="popover-user-followers"
          title={`${numberFormat(user.followersCount)} followers`}
          to={`/profile/${user.id}/followers`}
        >
          <IoMdPeople className="popover-icon" />
          {numberFormat(user.followersCount)}
        </Link>
      ) : (
        <></>
      )}
      {userId !== user.id ? (
        <StyledFollowBtn
          isFollow={following.findIndex((f) => f.id === user.id) !== -1}
          onClick={handleClickFollow(user.id)}
        />
      ) : (
        <></>
      )}
    </StyledDiv>
  )
}

export default PopoverContent
