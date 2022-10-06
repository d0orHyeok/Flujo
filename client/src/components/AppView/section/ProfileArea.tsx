import React, { useCallback, useState } from 'react'
import * as S from './ProfileArea.style'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { MenuItem } from '@components/Common'
import { BiLogInCircle } from 'react-icons/bi'
import { userLogout } from '@redux/thunks/userThunks'
import { useNavigate, Link } from 'react-router-dom'
import EmptyProfileImage from '@styles/EmptyImage/EmptyProfileImage.style'
import { useLoginOpen } from '@redux/context/loginProvider'

interface ProfileAreaProps {
  className?: string
  fold: string
}

const ProfileArea = ({ className, fold }: ProfileAreaProps) => {
  const user = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const openLoginModal = useLoginOpen()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (user.isLogin) {
      setAnchorEl(event.currentTarget)
    } else {
      openLoginModal()
    }
  }

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [])

  const handleClickAndNavigate = useCallback(
    (path: string) => (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault()
      navigate(path)
      handleClose()
    },
    [handleClose, navigate]
  )

  const handleClickLogout = useCallback(() => {
    localStorage.setItem('wave_login', 'false')
    dispatch(userLogout())
    handleClose()
    navigate(location.pathname)
  }, [dispatch, handleClose, navigate])

  return (
    <>
      <S.ProfileWrapper
        fold={fold}
        className={className && className}
        onClick={handleClick}
      >
        <S.ImageArea>
          {!user.isLogin ? (
            <BiLogInCircle className="empty-image" />
          ) : user.userData && user.userData.profileImage ? (
            <img
              className="user-image"
              src={user.userData.profileImage}
              alt=""
            />
          ) : (
            <EmptyProfileImage size={30} />
          )}
        </S.ImageArea>
        <span className="profile-username">
          {!user.isLogin
            ? 'Sign In'
            : user.userData?.nickname || user.userData?.username || 'User'}
        </span>
      </S.ProfileWrapper>

      <S.MyMenu
        fold={fold}
        anchorEl={anchorEl}
        open={open && user.isLogin}
        onClose={handleClose}
        disableScrollLock={true}
        anchorOrigin={{
          vertical: fold === 'true' ? 'top' : 'bottom',
          horizontal: fold === 'true' ? 'right' : 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: fold ? 'left' : 'right',
        }}
      >
        <MenuItem
          onClick={handleClickAndNavigate(
            `/profile/${user.userData?.id || 'you'}`
          )}
        >
          <Link to={`/profile/${user.userData?.id || 'you'}`}>Profile</Link>
        </MenuItem>
        <MenuItem onClick={handleClickAndNavigate(`/history`)}>
          <Link to="/history">History</Link>
        </MenuItem>
        <MenuItem onClick={handleClickAndNavigate('/settings')}>
          <Link to="/settings">Settings</Link>
        </MenuItem>
        <MenuItem onClick={handleClickLogout}>Sign Out</MenuItem>
      </S.MyMenu>
    </>
  )
}

export default React.memo(ProfileArea)
