import React, { useState } from 'react'
import { Modal } from '@components/Common'
import TextField from '@components/Common/TextField'
import * as S from './LoginModal.style'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '@redux/hook'
import { userAuth, userLogin } from '@redux/features/user/userSlice'

interface LoginModalProps {
  open: boolean
  onClose: () => void
}

const textFieldStyle = { width: '300px', marginBottom: '1rem' }

const LoginModal = ({ onClose, ...props }: LoginModalProps) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const [inputValue, setInputValue] = useState({
    username: window.localStorage.getItem('wave_id') || '',
    password: '',
  })
  const [saveID, setSaveID] = useState(
    Boolean(window.localStorage.getItem('wave_id'))
  )
  const [isError, setIsError] = useState({ username: false, password: false })

  const { username, password } = inputValue

  const closeModal = () => {
    setInputValue({
      username: window.localStorage.getItem('wave_id') || '',
      password: '',
    })
    setIsError({ username: false, password: false })
    onClose()
  }

  const handleChangeInput = (evnet: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = evnet.currentTarget
    setInputValue({ ...inputValue, [id]: value })
    setIsError({ ...isError, [id]: false })
  }

  const handleChangeSaveID = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.currentTarget
    setSaveID(checked)
    !checked && window.localStorage.removeItem('wave_id')
  }

  const handleClickRegister = () => {
    closeModal()
    navigate('/register')
  }

  const handleClickLogin = async () => {
    if (saveID) {
      window.localStorage.setItem('wave_id', inputValue.username)
    }
    try {
      await dispatch(userLogin(inputValue)).unwrap()
      console.log('Login Success')
      closeModal()
      await dispatch(userAuth())
    } catch (error) {
      console.log('Login Fail', error)
      if (error !== 'Auth Error') {
        const target = error === 'Wrong Password' ? 'password' : 'username'
        setIsError({ ...isError, [target]: true })
        document.getElementById(target)?.focus()
      }
    }
  }

  return (
    <Modal {...props} onClose={closeModal}>
      <S.ModalWrapper>
        <S.StyledContainer>
          <h1 className="modal-title">Sign In</h1>
          <S.Box>
            <TextField
              type="text"
              placeholder="ID"
              autoComplete="off"
              id="username"
              style={textFieldStyle}
              value={username}
              onChange={handleChangeInput}
              error={isError.username}
              errorText="해당하는 아이디를 찾을 수 없습니다."
            />
            <TextField
              type="password"
              autoComplete="off"
              placeholder="Password"
              id="password"
              style={textFieldStyle}
              value={password}
              onChange={handleChangeInput}
              error={isError.password}
              errorText="잘못된 비밀번호 입니다."
            />
          </S.Box>
          <S.Box className="signin-loginbox">
            <input
              type="checkbox"
              id="saveID"
              checked={saveID}
              onChange={handleChangeSaveID}
            />
            <label htmlFor="saveID">아이디 저장</label>
            <S.LoginButton onClick={handleClickLogin}>로그인</S.LoginButton>
          </S.Box>
          <S.Box className="signin-more">
            <ul className="signin-find">
              <li>
                <Link to="#">아이디 찾기</Link>
              </li>
              <li>
                <Link to="#">비밀번호 찾기</Link>
              </li>
            </ul>
            <span className="siginin-register">
              <Link to="register" onClick={handleClickRegister}>
                회원가입
              </Link>
            </span>
          </S.Box>
        </S.StyledContainer>
      </S.ModalWrapper>
    </Modal>
  )
}

export default React.memo(LoginModal)
