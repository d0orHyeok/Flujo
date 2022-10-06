import { IMusic } from '@appTypes/types.type.'
import React, { useCallback, useState } from 'react'
import { FaComment } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { EmptyProfileImage } from '@styles/EmptyImage'
import calculateDateAgo from '@api/functions/calculateDateAgo'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { RiDeleteBin5Fill } from 'react-icons/ri'
import { deleteComment } from '@api/commentApi'
import { convertTimeToString } from '@api/functions'
import {
  setCurrentMusic,
  setProgress,
  togglePlay,
} from '@redux/features/player/playerSlice'
import PopoverUser from '@components/PopoverUser/PopoverUser'
import * as S from './TrackComments.style'
import { Button } from '@components/Common'

interface TrackCommentsProps {
  music: IMusic
  setMusic: React.Dispatch<React.SetStateAction<IMusic | undefined>>
}

const TrackComments = ({ music, setMusic }: TrackCommentsProps) => {
  const dispatch = useAppDispatch()

  const userId = useAppSelector((state) => state.user.userData?.id)
  const duration = useAppSelector((state) => state.player.progress.duration)
  const currentMusic = useAppSelector((state) => state.player.currentMusic)

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
  const [anchorIndex, setAnchorIndex] = useState(-1)

  const handleClickCommentedAt = useCallback(
    (commentedAt: number) => async (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      event.stopPropagation()

      const percent = (commentedAt / duration) * 100

      if (currentMusic?.id !== music.id) {
        dispatch(setCurrentMusic(music))
      }

      dispatch(
        setProgress({
          currentTime: commentedAt,
          currentStringTime: convertTimeToString(commentedAt),
          percent,
        })
      )
      dispatch(togglePlay(true))

      const musicPlayer = document
        .getElementsByTagName('audio')
        .namedItem('wave-music-player')
      if (musicPlayer) {
        musicPlayer.currentTime = commentedAt
      }
    },
    [currentMusic?.id, dispatch, duration, music]
  )

  const handleClickDeleteBtn = useCallback(
    (index: number) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      setAnchorEl(event.currentTarget)
      setAnchorIndex(index)
    },
    []
  )

  const handleCloseDelete = useCallback(() => {
    setAnchorEl(null)
    setAnchorIndex(-1)
  }, [])

  const handleDeleteComment = useCallback(async () => {
    if (!anchorEl) return
    const dataId = anchorEl.getAttribute('data-id')
    if (!dataId) return

    const commentId = Number(dataId)

    try {
      await deleteComment(commentId)

      const existComments = music.comments || []
      const newComments = existComments.filter(
        (comment) => comment.id !== commentId
      )
      setMusic({
        ...music,
        comments: newComments,
        commentsCount: newComments.length,
      })
    } catch (error) {
      return alert('Failed to delete comment')
    }
  }, [anchorEl, music, setMusic])

  return music.commentsCount > 0 ? (
    <>
      <S.CommentHead>
        <FaComment className="icon comment" />
        {`${music.commentsCount} comments`}
      </S.CommentHead>
      <S.StyledDivider />
      <S.MusicComments>
        {music.comments.map((comment, index) => (
          <div key={index} className="comment-item">
            <div className="comment-imageBox">
              <Link
                className="comment-imageBox-link"
                to={`/profile/${comment.userId}`}
              >
                {comment.user.profileImage ? (
                  <img
                    className="comment-imageBox-image"
                    src={comment.user.profileImage}
                    alt=""
                  />
                ) : (
                  <EmptyProfileImage className="comment-imageBox-image" />
                )}
              </Link>
              <PopoverUser user={comment.user} />
            </div>
            <div className="comment-content">
              <div className="comment-content-top">
                <Link
                  className="comment-link"
                  to={`/profile/${comment.userId}`}
                >
                  {comment.user.nickname || comment.user.username}
                </Link>
                <button
                  className="commentedAt"
                  onClick={handleClickCommentedAt(comment.commentedAt)}
                >
                  {convertTimeToString(comment.commentedAt)}
                </button>
                <span className="createdAt">
                  {calculateDateAgo(comment.updatedAt || comment.createdAt)}
                </span>
              </div>
              <div className="comment-content-bottom">
                <pre className="text">{comment.text}</pre>

                {userId === comment.userId ? (
                  <S.DeleteButton
                    title="delete"
                    className={`deleteBtn ${
                      anchorIndex === index ? 'active' : ''
                    }`}
                    data-id={comment.id}
                    onClick={handleClickDeleteBtn(index)}
                  >
                    <RiDeleteBin5Fill />
                  </S.DeleteButton>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </S.MusicComments>

      <S.StyledPopover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleCloseDelete}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <S.Dialog>
          <div className="dialog-content">
            Do you really want to remove this comment?
            <div className="buttons">
              <Button className="delete-cancelBtn" onClick={handleCloseDelete}>
                Cancel
              </Button>
              <Button className="delete-yesBtn" onClick={handleDeleteComment}>
                Yes
              </Button>
            </div>
          </div>
        </S.Dialog>
      </S.StyledPopover>
    </>
  ) : (
    <S.EmptyComment>
      <FaComment className="icon comment" />
      <div className="text-main">Seems a little quiet over here</div>
      <div className="text-light">Be the first to comment on this track</div>
    </S.EmptyComment>
  )
}

export default TrackComments
