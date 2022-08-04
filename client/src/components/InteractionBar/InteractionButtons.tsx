import React, { useCallback, useLayoutEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { IoMdLink } from 'react-icons/io'
import { GoHeart } from 'react-icons/go'
import { MdPlaylistPlay, MdPlaylistAdd, MdOutlineEdit } from 'react-icons/md'
import { BiRepost } from 'react-icons/bi'
import { Button, Modal } from '@components/Common'
import { IMusic, IPlaylist } from '@appTypes/types.type.'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { useLoginOpen } from '@redux/context/loginProvider'
import { useCopyLink } from '@api/Hooks'
import { addMusic } from '@redux/features/player/playerSlice'
import AddPlaylist from '@components/InnerModal/AddPlaylist/AddPlaylist'
import { userToggleLike, userToggleRepost } from '@redux/thunks/userThunks'
import EditTarget from '@components/InnerModal/EditTarget/EditTarget'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { delelteMusic } from '@api/musicApi'
import { deletePlaylist } from '@api/playlistApi'
import { useNavigate } from 'react-router-dom'
import { useAlert } from '@redux/context/alertProvider'

interface StyledButtonProps {
  active?: boolean
  mediaSize?: number | string
}

const StyledButton = styled(Button)<StyledButtonProps>`
  position: relative;
  height: 27px;
  margin-right: 5px;
  border-radius: 3px;

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
}

interface Props
  extends React.HTMLAttributes<HTMLDivElement>,
    InteractionButtonsProps {}

const InteractionButtons = ({
  target,
  setTarget,
  mediaSize,
  ...props
}: Props) => {
  const dispatch = useAppDispatch()
  const openLogin = useLoginOpen()
  const copyLink = useCopyLink()
  const navigate = useNavigate()
  const openAlert = useAlert()

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

  const handleClickRepost = useCallback(() => {
    if (!userData) {
      openLogin()
      return
    }

    const targetType = 'title' in target ? 'music' : 'playlist'
    dispatch(userToggleRepost({ targetId: target.id, targetType })).then(
      (value: any) => {
        if (value.type.indexOf('fulfilled') !== -1 && setTarget) {
          const existReposts =
            target.reposts ||
            Array.from({ length: target.repostsCount || 0 }, (v, i) => i)
          const newReposts =
            value.payload.data.toggleType === 'repost'
              ? [...existReposts, userData]
              : existReposts.filter((ru) => ru.id !== userData.id)
          setTarget({
            ...target,
            reposts: newReposts,
            repostsCount: newReposts.length,
          })
        }
      }
    )
  }, [dispatch, openLogin, setTarget, target, userData])

  const handleClickLike = useCallback(() => {
    if (!userData) {
      openLogin()
      return
    }

    const targetType = 'title' in target ? 'music' : 'playlist'
    dispatch(userToggleLike({ targetId: target.id, targetType })).then(
      (value: any) => {
        if (value.type.indexOf('fulfilled') !== -1) {
          if (setTarget) {
            const existLikes =
              target.likes ||
              Array.from({ length: target.likesCount || 0 }, (v, i) => i)
            const newLikes =
              value.payload.data.toggleType === 'like'
                ? [...existLikes, userData]
                : existLikes.filter((l) => l.id !== userData.id)
            setTarget({
              ...target,
              likes: newLikes,
              likesCount: newLikes.length,
            })
          }
        }
      }
    )
  }, [userData, target, openLogin, dispatch, setTarget])

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

  const handleClickAddPlaylist = useCallback(() => {
    if (!userData) {
      openLogin()
      return
    }

    setOpenModal(true)
  }, [openLogin, userData])

  const closeModal = () => {
    setOpenModal(false)
  }

  const handleClickCopyLink = useCallback(() => {
    copyLink(target.permalink, {
      success: 'Link Copied',
      fail: 'Fail to copy link',
    })
  }, [copyLink, target])

  const handleClickNextup = useCallback(() => {
    const additem = 'title' in target ? [target] : target.musics || []

    dispatch(addMusic(additem))

    const message =
      additem.length === 1
        ? `"${additem[0].title}" added to Next up`
        : `${additem.length} tracks added to Next up`

    openAlert(message, { severity: 'info' })
  }, [dispatch, openAlert, target])

  const handleClickDelete = useCallback(async () => {
    if (!confirm('Are you sure you want to delete it?')) return

    try {
      if ('title' in target) {
        await delelteMusic(target.id)
        navigate(`/profile/${target.userId}/${'tracks'}`)
        openAlert(`Delete Success: ${target.title}`, { severity: 'success' })
      } else {
        await deletePlaylist(target.id)
        navigate(`/profile/${target.userId}/${'playlists'}`)
        openAlert(`Delete Success: ${target.name}`, { severity: 'success' })
      }
    } catch (error: any) {
      console.error(error.response || error)
      openAlert(`Fail to delete`, { severity: 'error' })
    }
  }, [navigate, openAlert, target])

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
          <Modal open={openModal} onClose={closeModal}>
            <AddPlaylist
              addMusics={[target]}
              onClose={closeModal}
              onCreateSuccess={onSuccessCreatePlaylist}
              onAddSuccess={onSuccessCreatePlaylist}
              onRemoveSuccess={onRemoveMusicSuccess}
            />
          </Modal>
        </>
      )}
      {userData && target.userId === userData.id && (
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
          <Modal open={openEditTarget} onClose={closeEditTarget}>
            <EditTarget
              target={target}
              onClose={closeEditTarget}
              setTarget={setTarget}
            />
          </Modal>
        </>
      )}
    </div>
  )
}

export default InteractionButtons
