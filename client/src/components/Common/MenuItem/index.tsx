import styled from 'styled-components'
import { MenuItem as MuiMenuItem, MenuItemProps } from '@mui/material'
import { MdPlaylistAdd, MdPlaylistPlay } from 'react-icons/md'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { addMusic } from '@redux/features/player/playerSlice'
import { IMusic } from '@appTypes/types.type.'
import React, { useCallback, useState } from 'react'
import { Modal } from '@components/Common'
import AddPlaylist from '@components/InnerModal/AddPlaylist/AddPlaylist'
import { selectUser } from '@redux/features/user/userSlice'
import { useLoginOpen } from '@redux/context/loginProvider'

const MenuItem = styled(MuiMenuItem)`
  &.MuiMenuItem-root:hover {
    background-color: ${({ theme }) => theme.colors.border1};
  }
`

const MusicMenuItem = styled(MenuItem)`
  font-size: 16px;
  line-height: 16px;

  ${({ theme }) => theme.device.tablet} {
    font-size: 14px;
    line-height: 14px;
  }
  ${({ theme }) => theme.device.mobile} {
    font-size: 12px;
    line-height: 12px;
  }

  &.MuiMenuItem-root {
    padding: 0.5em 0;
    font-size: 0.75em;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border1};

    &:last-child {
      border-bottom: none;
    }
  }

  & .icon {
    margin: 0 0.5em;
    width: 16px;
    height: 16px;
  }
`

interface ICustionMusicMenuItemProps extends MenuItemProps {
  onClose?: React.MouseEventHandler<HTMLLIElement | HTMLElement>
}

interface IAddMusicMenuItemProps extends ICustionMusicMenuItemProps {
  musics?: IMusic[]
}

interface IAddPlaylistMenuItemProps extends ICustionMusicMenuItemProps {
  musics?: IMusic[]
}

const AddMusicMenuItem = ({
  musics,
  onClick,
  onClose,
  ...props
}: IAddMusicMenuItemProps) => {
  const dispatch = useAppDispatch()

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLLIElement>) => {
      if (onClick) {
        onClick(event)
      } else {
        if (musics) {
          dispatch(addMusic(musics))
        }
        onClose && onClose(event)
      }
    },
    [dispatch, musics, onClick, onClose]
  )

  return (
    <MusicMenuItem onClick={handleClick} {...props}>
      <MdPlaylistPlay className="icon" />
      <span>Add to Next up</span>
    </MusicMenuItem>
  )
}

const AddPlaylistMenuItem = ({
  musics,
  onClick,
  onClose,
  ...props
}: IAddPlaylistMenuItemProps) => {
  const user = useAppSelector(selectUser)

  const [open, setOpen] = useState(false)
  const openLoginModal = useLoginOpen()

  const closeModal = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setOpen(false)
      onClose && onClose(event)
    },
    [onClose]
  )

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLLIElement>) => {
      if (onClick) {
        onClick(event)
      } else {
        if (!user.isLogin) {
          openLoginModal()
          onClose && onClose(event)
        } else {
          const { parentElement } = event.currentTarget
          if (parentElement) parentElement.style.display = 'none'
          setOpen(true)
        }
      }
    },
    [onClose, openLoginModal, onClick, user.isLogin]
  )

  return (
    <>
      <MusicMenuItem onClick={handleClick} {...props}>
        <MdPlaylistAdd className="icon" />
        <span>Add to Playlist</span>
      </MusicMenuItem>
      <Modal open={open} onClose={closeModal}>
        <AddPlaylist addMusics={musics} onClose={closeModal} />
      </Modal>
    </>
  )
}

export { MusicMenuItem, AddMusicMenuItem, AddPlaylistMenuItem }
export default MenuItem
