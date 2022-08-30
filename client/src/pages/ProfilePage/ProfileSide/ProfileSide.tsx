import * as S from './ProfileSide.style'
import React, { useEffect, useState, useCallback } from 'react'
import { IUser } from '@appTypes/user.type'
import { GoHeart } from 'react-icons/go'
import { Link } from 'react-router-dom'
import { EmptyMusicCover, EmptyProfileImage } from '@styles/EmptyImage'
import InteractionCount from '@components/InteractionBar/InteractionCount'
import { IMusic } from '@appTypes/music.type'
import { numberFormat, sortByCreatedAt } from '@api/functions'
import { BsFillPeopleFill, BsPersonFill, BsSoundwave } from 'react-icons/bs'
import PopoverUser from '@components/PopoverUser/PopoverUser'
import { FollowTextButton } from '@components/Common/Button'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { userToggleFollow } from '@redux/thunks/userThunks'
import { FaComment } from 'react-icons/fa'
import { IComment } from '@appTypes/comment.type'
import { getCommentsByUserId } from '@api/commentApi'
import calculateDateAgo from '@api/functions/calculateDateAgo'

interface ProfileSideProps {
  user: IUser
}

const ProfileSide = ({ user }: ProfileSideProps) => {
  const dispatch = useAppDispatch()

  const myId = useAppSelector((state) => state.user.userData?.id)
  const following = useAppSelector(
    (state) => state.user.userData?.following || []
  )
  const [userLikes, setUserLikes] = useState<IMusic[]>([])
  const [comments, setComments] = useState<IComment[]>([])

  const getComments = useCallback(async () => {
    try {
      const response = await getCommentsByUserId(user.id)
      setComments(response.data)
    } catch (error) {
      console.error(error)
      setComments((prev) => prev)
    }
  }, [user.id])

  const handleClickFollow = useCallback(
    (id: string) => (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      dispatch(userToggleFollow(id))
    },
    [dispatch]
  )

  useEffect(() => {
    getComments()
  }, [getComments])

  useEffect(() => {
    const sorted = sortByCreatedAt([...user.likeMusics])
    setUserLikes(sorted)
  }, [user])

  return (
    <S.Container>
      <S.NumBox>
        <S.NumBoxItem>
          <Link to={`/profile/${user.id}/followers`}>
            <h3 className="tag">Followers</h3>
            <div className="num">{numberFormat(user.followersCount)}</div>
          </Link>
        </S.NumBoxItem>
        <S.NumBoxItem>
          <Link to={`/profile/${user.id}/following`}>
            <h3 className="tag">Following</h3>
            <div className="num">{numberFormat(user.followingCount)}</div>
          </Link>
        </S.NumBoxItem>
        <S.NumBoxItem>
          <Link to={`/profile/${user.id}/tracks`}>
            <h3 className="tag">Tracks</h3>
            <div className="num">{numberFormat(user.musicsCount)}</div>
          </Link>
        </S.NumBoxItem>
      </S.NumBox>
      {user.description ? (
        <S.DescBox>
          <pre>{user.description}</pre>
        </S.DescBox>
      ) : (
        <></>
      )}
      {userLikes.length ? (
        <>
          <S.BoxTitle>
            <GoHeart className="icon" />
            <div className="text">Likes</div>
            <div className="view">
              <Link to={`/profile/${user.id}/likes`}>View all</Link>
            </div>
          </S.BoxTitle>
          <S.StyledDivider />
          <S.ItemBox>
            {userLikes.slice(0, 3).map((item, index) => {
              const link = `/track/${item.userId}/${item.permalink}`
              return (
                <S.Item key={index}>
                  <div className="imgBox">
                    <Link className="link" to={link}>
                      {item.cover ? (
                        <img className="img" src={item.cover} alt="" />
                      ) : (
                        <EmptyMusicCover className="img" />
                      )}
                    </Link>
                  </div>
                  <div className="info">
                    <div className="user">
                      <Link to={`/profile/${item.userId}`}>
                        {item.user?.nickname || item.user?.username}
                      </Link>
                    </div>
                    <div className="name">
                      <Link to={link}>{item.title}</Link>
                    </div>
                    <InteractionCount target={item} />
                  </div>
                </S.Item>
              )
            })}
          </S.ItemBox>
        </>
      ) : (
        <></>
      )}
      {user.followersCount ? (
        <>
          <S.BoxTitle>
            <BsPersonFill className="icon" />
            <div className="text">Followers</div>
            <div className="view">
              <Link to={`/profile/${user.id}/followers`}>View all</Link>
            </div>
          </S.BoxTitle>
          <S.StyledDivider />
          <S.UserBox>
            {user.followers &&
              user.followers.slice(0, 10).map((user, index) => (
                <S.UserItem key={index}>
                  <div className="imgBox">
                    <Link className="link" to={`/profile/${user.id}`}>
                      {user.profileImage ? (
                        <img className="img" src={user.profileImage} alt="" />
                      ) : (
                        <EmptyProfileImage className="img" />
                      )}
                    </Link>
                  </div>

                  {/* popover content */}
                  <PopoverUser user={user} />
                </S.UserItem>
              ))}
          </S.UserBox>
        </>
      ) : (
        <></>
      )}
      {user.followingCount ? (
        <>
          <S.BoxTitle>
            <BsFillPeopleFill className="icon" />
            <div className="text">Following</div>
            <div className="view">
              <Link to={`/profile/${user.id}/following`}>View all</Link>
            </div>
          </S.BoxTitle>
          <S.StyledDivider />
          <S.ItemBox>
            {user.following.slice(0, 3).map((f, index) => {
              const isFollow =
                following.findIndex((follow) => follow.id === f.id) !== -1
              return (
                <S.ItemFollowing key={index}>
                  <div className="imgBox">
                    <Link className="link" to={`/profile/${f.id}`}>
                      {f.profileImage ? (
                        <img className="img" src={f.profileImage} alt="" />
                      ) : (
                        <EmptyProfileImage className="img" />
                      )}
                    </Link>
                  </div>
                  <div className="info">
                    <div className="name">
                      <Link to={`/profile/${f.id}`}>
                        {f.nickname || f.username}
                      </Link>
                    </div>
                    <div className="num">
                      <div className="num-item">
                        <Link
                          to={`/profile/${f.id}/followers`}
                          title={`${numberFormat(
                            user.followersCount
                          )} followers`}
                        >
                          <BsFillPeopleFill className="icon people" />
                          {numberFormat(user.followersCount)}
                        </Link>
                      </div>
                      <div className="num-item">
                        <Link
                          to={`/profile/${f.id}/tracks`}
                          title={`${numberFormat(user.musicsCount)} tracks`}
                        >
                          <BsSoundwave className="icon soundwave" />
                          {numberFormat(user.musicsCount)}
                        </Link>
                      </div>

                      <FollowTextButton
                        className="num-button"
                        isFollow={isFollow}
                        onClick={handleClickFollow(f.id)}
                        style={{
                          visibility: myId !== f.id ? 'visible' : 'hidden',
                        }}
                      />
                    </div>
                  </div>
                </S.ItemFollowing>
              )
            })}
          </S.ItemBox>
        </>
      ) : (
        <></>
      )}
      {comments.length ? (
        <>
          <S.BoxTitle>
            <FaComment className="icon" />
            <div className="text">Latest Comments</div>
            <div className="view">
              <Link to={`/profile/${user.id}/comments`}>View all</Link>
            </div>
          </S.BoxTitle>
          <S.StyledDivider />
          <S.ItemBox>
            {sortByCreatedAt(comments)
              .slice(0, 3)
              .map((comment: IComment, index) => (
                <S.CommentItem key={index}>
                  <h3 className="head">
                    <div className="music-title">
                      <Link
                        to={`/track/${comment.music.userId}/${comment.music.permalink}`}
                      >
                        {comment.music.title}
                      </Link>
                    </div>
                    <div className="createdAt">
                      {calculateDateAgo(comment.createdAt)}
                    </div>
                  </h3>
                  <div className="text">{comment.text}</div>
                </S.CommentItem>
              ))}
          </S.ItemBox>
        </>
      ) : (
        <></>
      )}
    </S.Container>
  )
}

export default ProfileSide
