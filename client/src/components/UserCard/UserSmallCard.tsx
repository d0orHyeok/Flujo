import { IUser } from '@appTypes/types.type.'
import React from 'react'
import { Link } from 'react-router-dom'
import * as S from './UserSmallCard.style'
import { EmptyProfileImage } from '@styles/EmptyImage'

export interface IUserSmallCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  user: IUser
  subText?: string
}

const MusicSmallCard = ({ user, subText, ...props }: IUserSmallCardProps) => {
  return (
    <>
      <S.CardContainer {...props}>
        <Link to={`/profile/${user.id}/tracks`}>
          <S.ImageBox>
            {user.profileImage ? (
              <img className="img" src={user.profileImage} alt="" />
            ) : (
              <EmptyProfileImage className="img" />
            )}
            <div className="absolute nickname">
              {user.nickname || user.username}
            </div>
            <div className="absolute subText">{subText}</div>
          </S.ImageBox>
        </Link>

        {/* description */}
        <S.CartInfoBox>
          <div className="userCard-nickname">
            <Link to={`/profile/${user.id}/tracks`}>
              {user.nickname || user.username}
            </Link>
          </div>
          <div className="userCard-subText">{subText}</div>
        </S.CartInfoBox>
      </S.CardContainer>
    </>
  )
}

export default MusicSmallCard
