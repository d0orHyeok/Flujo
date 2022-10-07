import React, { useCallback, useLayoutEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { IoMdLink } from 'react-icons/io'
import { GoHeart } from 'react-icons/go'
import { MdPlaylistPlay, MdPlaylistAdd, MdOutlineEdit } from 'react-icons/md'
import { BiRepost } from 'react-icons/bi'
import { Button } from '@components/Common'
import { IMusic, IPlaylist } from '@appTypes/types.type.'
import { useAppDispatch, useAppSelector, useAuthDispatch } from '@redux/hook'
import { useLoginOpen } from '@redux/context/loginProvider'
import { useCopyLink } from '@api/Hooks'
import { addMusic } from '@redux/features/player/playerSlice'
import AddPlaylist from '@components/InDialog/AddPlaylist/AddPlaylist'
import {
  userDeleteItem,
  userToggleLike,
  userToggleRepost,
} from '@redux/thunks/userThunks'
import EditTarget from '@components/InDialog/EditTarget/EditTarget'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useAlert } from '@redux/context/alertProvider'
import { useNavigate } from 'react-router-dom'
import Dialog, { getTransitionSlide } from '@components/Common/Dialog'

interface StyledButtonProps {
  active?: boolean
  mediaSize?: number | string
}

const StyledButton = styled(Button)<StyledButtonProps>`
  position: relative;
  height: 27px;
  margin-right: 5px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.colors.bgColor};

  &:last-child {
    margin-right: 0;
  }

  ${({ theme, active }) =>
    active &&
    `
    &, &:hover {
    border-color: ${theme.colors.primaryColor};
    color: ${theme.colors.primaryColor};
    }`}

  & .icon {
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    font-size: 18px;
    margin: 0 5px;
  }

  & .text {
    display: inline-block;
    font-size: 13px;
    height: 25px;
    margin-right: 5px;

    ${({ mediaSize }) => {
      const size =
        mediaSize === undefined
          ? '1200px'
          : typeof mediaSize === 'string'
          ? mediaSize
          : `${mediaSize}px`
      return css`
        @media screen and (max-width: ${size}) {
          display: none;
        }
      `
    }}
  }
`

type TargetType = IMusic | IPlaylist

export interface InteractionButtonsProps {
  target: TargetType
  setTarget?: (value: any) => void
  mediaSize?: number | string
  disableEdit?: boolean
}

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    InteractionButtonsProps {}

const Transition = getTransitionSlide('down')

const InteractionButtons = ({
  target,
  setTarget,
  mediaSize,
  disableEdit,
  ...props
}: Props) => {
  const dispatch = useAppDispatch()
  const authDispath = useAuthDispatch()
  const openLogin = useLoginOpen()
  const copyLink = useCopyLink()
  const openAlert = useAlert()
  const navigate = useNavigate()

  const userData = useAppSelector((state) => state.user.userData)
  const [openEditTarget, setOpenEditTarget] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [isLike, setIsLike] = useState(false)
  const [isReposts, setIsReposts] = useState(false)

  const handleClickEditTarget = useCallback(() => {
    setOpenEditTarget(true)
  }, [])

  const closeEditTarget = useCallback(() => {
    setOpenEditTarget(false)
  }, [])

  const handleClickRepost = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      const targetType = 'title' in target ? 'music' : 'playlist'
      authDispath(userToggleRepost({ targetId: target.id, targetType })).then(
        (value: any) => {
          if (value.type.includes('fulfilled') && setTarget) {
            const existReposts =
              target.reposts ||
              Array.from({ length: target.repostsCount || 0 }, (v, i) => i)
            const newReposts =
              value.payload.data.toggleType === 'repost'
                ? [...existReposts, userData]
                : existReposts.filter((ru) => ru.id !== userData?.id)
            setTarget({
              ...target,
              reposts: newReposts,
              repostsCount: newReposts.length,
            })
          }
        }
      )
    },
    [authDispath, setTarget, target, userData]
  )

  const handleClickLike = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      const targetType = 'title' in target ? 'music' : 'playlist'
      authDispath(userToggleLike({ targetId: target.id, targetType })).then(
        (value: any) => {
          if (value.type.includes('fulfilled')) {
            if (setTarget) {
              const existLikes =
                target.likes ||
                Array.from({ length: target.likesCount || 0 }, (v, i) => i)
              const newLikes =
                value.payload.data.toggleType === 'like'
                  ? [...existLikes, userData]
                  : existLikes.filter((l) => l.id !== userData?.id)
              setTarget({
                ...target,
                likes: newLikes,
                likesCount: newLikes.length,
              })
            }
          }
        }
      )
    },
    [target, authDispath, setTarget, userData]
  )

  const onSuccessCreatePlaylist = useCallback(
    (createPlaylist: IPlaylist) => {
      if (!('title' in target) || !setTarget) {
        return
      }
      const existPlaylists = target.playlists || []
      const newPlaylists = [...existPlaylists, createPlaylist]
      setTarget({
        ...target,
        playlists: newPlaylists,
        playlistsCount: newPlaylists.length,
      })
    },
    [setTarget, target]
  )

  const onRemoveMusicSuccess = useCallback(
    (playlistId: number) => {
      if (!('title' in target) || !setTarget) {
        return
      }
      const existPlaylists = target.playlists || []
      const newPlaylists = existPlaylists.filter(
        (playlist) => playlist.id !== playlistId
      )
      setTarget({
        ...target,
        playlists: newPlaylists,
        playlistsCount: newPlaylists.length,
      })
    },
    [setTarget, target]
  )

  const handleClickAddPlaylist = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      event.preventDefault()
      if (!userData) {
        openLogin()
        return
      }
      setOpenModal(true)
    },
    [openLogin, userData]
  )

  const closeModal = () => {
    setOpenModal(false)
  }

  const handleClickCopyLink = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      copyLink(target.permalink, {
        success: 'Link Copied',
        fail: 'Fail to copy link',
      })
    },
    [copyLink, target]
  )

  const handleClickNextup = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()
      const additem = 'title' in target ? [target] : target.musics || []

      dispatch(addMusic(additem))

      const message =
        additem.length === 1
          ? `"${additem[0].title}" added to Next up`
          : `${additem.length} tracks added to Next up`

      openAlert(message, { severity: 'info' })
    },
    [dispatch, openAlert, target]
  )

  const handleClickDelete = useCallback(async () => {
    if (!confirm('Are you sure you want to delete it?')) return

    try {
      if ('title' in target) {
        await dispatch(
          userDeleteItem({ targetId: target.id, targetType: 'music' })
        ).unwrap()
        openAlert(`Delete Success: ${target.title}`, { severity: 'success' })
        navigate(`/profile/${target.userId}/tracks`)
      } else {
        await dispatch(
          userDeleteItem({ targetId: target.id, targetType: 'playlist' })
        ).unwrap()
        openAlert(`Delete Success: ${target.name}`, { severity: 'success' })
        navigate(`/profile/${target.userId}/playlists`)
      }
    } catch (error: any) {
      console.error(error.response || error)
      openAlert(`Fail to delete`, { severity: 'error' })
    }
  }, [dispatch, navigate, openAlert, target])

  useLayoutEffect(() => {
    if (!userData) {
      setIsLike(false)
      setIsReposts(false)
      return
    }

    let userLikes: TargetType[] = []
    let userReposts: TargetType[] = []
    if ('title' in target) {
      userLikes = userData.likeMusics || []
      userReposts = userData.repostMusics || []
    } else {
      userLikes = userData.likePlaylists || []
      userReposts = userData.repostPlaylists || []
    }

    const booleanLike = userLikes.findIndex((l) => l.id === target.id) !== -1
    const booleanRepost =
      userReposts.findIndex((r) => r.id === target.id) !== -1
    setIsLike(booleanLike)
    setIsReposts(booleanRepost)
  }, [target, userData])

  return (
    <div {...props}>
      <StyledButton
        title="Like"
        active={isLike}
        mediaSize={mediaSize}
        onClick={handleClickLike}
      >
        <GoHeart className="icon" />
        <span className="text">Like</span>
      </StyledButton>
      {userData && target.userId !== userData.id && (
        <StyledButton
          title="Repost"
          active={isReposts}
          mediaSize={mediaSize}
          onClick={handleClickRepost}
        >
          <BiRepost className="icon" />
          <span className="text">Repost</span>
        </StyledButton>
      )}
      <StyledButton
        title="Copy Link"
        mediaSize={mediaSize}
        onClick={handleClickCopyLink}
      >
        <IoMdLink className="icon" />
        <span className="text">Copy Link</span>
      </StyledButton>
      <StyledButton
        title="Add to Next up"
        mediaSize={mediaSize}
        onClick={handleClickNextup}
      >
        <MdPlaylistPlay className="icon" />
        <span className="text">Add to Next up</span>
      </StyledButton>
      {'title' in target && (
        <>
          <StyledButton
            title="Add to Playlist"
            mediaSize={mediaSize}
            onClick={handleClickAddPlaylist}
          >
            <MdPlaylistAdd className="icon" />
            <span className="text">Add to Playlist</span>
          </StyledButton>
          <Dialog
            open={openModal}
            onClose={closeModal}
            TransitionComponent={Transition}
            PaperProps={{ style: { maxWidth: '500px', width: '100%' } }}
          >
            <AddPlaylist
              addMusics={[target]}
              onClose={closeModal}
              onCreateSuccess={onSuccessCreatePlaylist}
              onAddSuccess={onSuccessCreatePlaylist}
              onRemoveSuccess={onRemoveMusicSuccess}
            />
          </Dialog>
        </>
      )}
      {!disableEdit && userData && target.userId === userData.id && (
        <>
          <StyledButton
            title="Edit"
            mediaSize={mediaSize}
            onClick={handleClickEditTarget}
          >
            <MdOutlineEdit className="icon" />
            <span className="text">Edit</span>
          </StyledButton>
          <StyledButton
            title="Delete"
            mediaSize={mediaSize}
            onClick={handleClickDelete}
          >
            <RiDeleteBin6Line className="icon" />
          </StyledButton>
          <Dialog
            open={openEditTarget}
            onClose={closeEditTarget}
            TransitionComponent={Transition}
          >
            <EditTarget
              target={target}
              onClose={closeEditTarget}
              setTarget={setTarget}
            />
          </Dialog>
        </>
      )}
    </div>
  )
}

export default InteractionButtons
