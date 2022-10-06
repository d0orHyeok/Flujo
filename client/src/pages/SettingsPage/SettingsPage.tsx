import React, { useCallback, useEffect, useState } from 'react'
import { useAppTheme } from '@redux/context/appThemeProvider'
import { Helmet } from 'react-helmet-async'
import * as S from './SettingsPage.style'
import { Button } from '@components/Common'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { PrimaryButton } from '@components/Common/Button'
import { emailRegex, passwordRegex } from '@pages/RegisterPage/regex'
import { changePassword } from '@api/userApi'
import Reload from '@components/Loading/Reload'
import { useAlert } from '@redux/context/alertProvider'
import { userChangeEmail, userDeleteAccount } from '@redux/thunks/userThunks'
import { useNavigate } from 'react-router-dom'

const SettingsPage = () => {
  const [ThemeMode, toggleTheme] = useAppTheme()
  const openAlert = useAlert()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const userData = useAppSelector((state) => state.user.userData)

  const [email, setEmail] = useState({ open: false, email: '', request: false })
  const [changePW, setChangePW] = useState({ open: false, request: false })
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  })
  const [error, setError] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleClickEditEmail = useCallback(
    (open: boolean) => (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      setEmail({ open, email: userData?.email || '', request: false })
    },
    [userData?.email]
  )

  const handleChangeEmailInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.currentTarget
      setEmail((state) => {
        if (state.request) {
          return state
        } else {
          return { open: true, email: value, request: false }
        }
      })
    },
    []
  )

  const handleClickChangeEmail = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      if (!emailRegex.test(email.email)) {
        return
      }
      try {
        setEmail((state) => {
          return { ...state, request: true }
        })
        await dispatch(userChangeEmail(email.email)).unwrap()
        openAlert('Email Address has been changed.', { severity: 'success' })
        setEmail((state) => {
          return { ...state, open: false, request: false }
        })
      } catch (error) {
        console.error(error)
        setEmail((state) => {
          return { ...state, request: false }
        })
        alert('Failed to change email address')
      }
    },
    [email, openAlert, dispatch]
  )

  const handleChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = event.currentTarget

      setPassword((state) => {
        return { ...state, [id]: value }
      })

      if (id === 'current') {
        setError((state) => {
          return { ...state, current: false }
        })
      }
    },
    []
  )

  const handleClickPWChange = useCallback(
    async (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()
      event.stopPropagation()

      const entries = Object.entries(error)
      const errorItem = entries.find((item) => item[1] === true)

      if (errorItem) {
        // 잘못입력한 비밀번호가 있다면 다시 입력하도록
        const key = errorItem[0]
        document.getElementById(key)?.focus()
        const target =
          key === 'confirm' ? 'password confirmed' : `${key} password`
        alert(`Please check ${target}`)
        return
      }

      // 비밀번호 변경 요청
      setChangePW({ request: true, open: true })
      try {
        const body = {
          password: password.current,
          newPassword: password.new,
        }

        const response = await changePassword(body)
        const { success } = response.data

        if (!success || success === false) {
          // 잘못된 현재비밀번호로 요청 실패시
          setError((state) => {
            return { ...state, current: true }
          })
          setChangePW({ request: false, open: true })
          return document.getElementById('current')?.focus()
        }

        // 성공했을 경우 성공했다고 알리고 사용된 states 초기화
        openAlert('Password has been changed.', { severity: 'success' })
        setPassword({ current: '', new: '', confirm: '' })
        setError({ current: false, new: false, confirm: false })
        setChangePW({ request: false, open: false })
      } catch (error) {
        console.error(error)
        setChangePW({ request: false, open: true })
        alert('Error to change password')
      }
    },
    [error, openAlert, password]
  )

  const handleClickDelete = useCallback(async () => {
    if (!confirm('Are you sure you want to delete the account?')) {
      return
    }
    try {
      await dispatch(userDeleteAccount()).unwrap()
      openAlert('Account has been deleted', { severity: 'success' })
      navigate('/')
    } catch (error) {
      console.error(error)
      openAlert('Failed to delete account', { severity: 'error' })
    }
  }, [dispatch, navigate, openAlert])

  const checkInputValue = useCallback(() => {
    if (password.new.length) {
      const errorNew = !passwordRegex.test(password.new)
      const errorConfirm =
        Boolean(password.confirm.length) && password.confirm !== password.new

      setError((state) => {
        return { ...state, new: errorNew, confirm: errorConfirm }
      })
    } else {
      setError((state) => {
        return { ...state, new: false, confirm: false }
      })
    }
  }, [password.confirm, password.new])

  useEffect(() => {
    checkInputValue()
  }, [checkInputValue])

  return (
    <>
      <Helmet>
        <title>Settings | Wave</title>
      </Helmet>
      <S.Wrapper>
        <h1 className="title">Settings</h1>
        <S.ItemBox>
          <h2 className="item-title">Email address</h2>
          <div className="item-divider"></div>
          <div className="item-content">
            {!email.open ? (
              <>
                <span style={{ marginRight: '8px' }}>{userData?.email}</span>
                <Button
                  className="btn changeBtn"
                  onClick={handleClickEditEmail(true)}
                >
                  Edit
                </Button>
              </>
            ) : (
              <S.InputItembox>
                <div className="inputbox">
                  <div className="flexbox">
                    <label htmlFor="current">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      value={email.email}
                      onChange={handleChangeEmailInput}
                    />
                  </div>
                  {!emailRegex.test(email.email) ? (
                    <div className="error">Invalid Email</div>
                  ) : null}
                </div>
                <div className="btn-group">
                  {email.request ? (
                    <>
                      <span>Saving</span>
                      <Reload size={40} style={{ marginLeft: '10px' }} />
                    </>
                  ) : (
                    <>
                      <Button
                        className="btn pw-cancelBtn"
                        onClick={handleClickEditEmail(false)}
                      >
                        Cancel
                      </Button>
                      <PrimaryButton
                        className="btn pw-changeBtn"
                        onClick={handleClickChangeEmail}
                      >
                        Change
                      </PrimaryButton>
                    </>
                  )}
                </div>
              </S.InputItembox>
            )}
          </div>
        </S.ItemBox>
        <S.ItemBox>
          <h2 className="item-title">Password</h2>
          <div className="item-divider"></div>
          <S.InputItembox className="item-content">
            {!changePW.open ? (
              <Button
                className="btn changeBtn"
                onClick={() => setChangePW({ request: false, open: true })}
              >
                Change Password
              </Button>
            ) : (
              <>
                <div className="inputbox">
                  <div className="flexbox">
                    <label htmlFor="current">Current Password</label>
                    <input
                      id="current"
                      type="password"
                      value={password.current}
                      onChange={handleChangeInput}
                    />
                  </div>
                  {error.current ? (
                    <div className="error">Wrong password</div>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="inputbox">
                  <div className="flexbox">
                    <label htmlFor="new">New Password</label>
                    <input
                      id="new"
                      type="password"
                      value={password.new}
                      onChange={handleChangeInput}
                    />
                  </div>
                  {error.new ? (
                    <div className="error">
                      {password.new === password.current ? (
                        'The password is the same as the current password.'
                      ) : (
                        <pre>
                          {`Please enter a password of 6-20 characters\nincluding English letters and numbers`}
                        </pre>
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="inputbox">
                  <div className="flexbox">
                    <label htmlFor="confirm">Password Confirmed</label>
                    <input
                      id="confirm"
                      type="password"
                      value={password.confirm}
                      onChange={handleChangeInput}
                    />
                  </div>
                  {error.confirm ? (
                    <div className="error">New password does not match</div>
                  ) : (
                    <></>
                  )}
                </div>

                <div className="btn-group">
                  {changePW.request ? (
                    <>
                      <span>Saving</span>
                      <Reload size={40} style={{ marginLeft: '10px' }} />
                    </>
                  ) : (
                    <>
                      <Button
                        className="btn pw-cancelBtn"
                        onClick={() =>
                          setChangePW({ request: false, open: false })
                        }
                      >
                        Cancel
                      </Button>
                      <PrimaryButton
                        className="btn pw-changeBtn"
                        onClick={handleClickPWChange}
                      >
                        Change
                      </PrimaryButton>
                    </>
                  )}
                </div>
              </>
            )}
          </S.InputItembox>
        </S.ItemBox>
        <S.ItemBox>
          <h2 className="item-title">Site Theme</h2>
          <div className="item-divider"></div>
          <S.ThemeItemContent className="item-content">
            <span className="theme">{`${ThemeMode.charAt(
              0
            ).toUpperCase()}${ThemeMode.slice(1)} Mode`}</span>
            <Button className="btn toggleBtn" onClick={toggleTheme}>
              Toggle Theme
            </Button>
          </S.ThemeItemContent>
        </S.ItemBox>
        <S.ItemBox>
          <h2 className="item-title">Account</h2>
          <div className="item-divider"></div>
          <S.DeleteBtn onClick={handleClickDelete}>Delete Account</S.DeleteBtn>
        </S.ItemBox>
      </S.Wrapper>
    </>
  )
}

export default SettingsPage
