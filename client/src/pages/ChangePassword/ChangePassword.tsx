import LoadingPage from '@components/Loading/LoadingPage'
import { passwordRegex } from '@pages/RegisterPage/regex'
import { useAlert } from '@redux/context/alertProvider'
import { useSetMinWidth } from '@redux/context/appThemeProvider'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as S from './ChangePassword.style'

const ChangePassword = () => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const setMinWidth = useSetMinWidth()
  const openAlert = useAlert()

  const [token, setToken] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState({ new: '', confirm: '' })
  const [error, setError] = useState({ new: false, confirm: false })

  const checkQuery = useCallback(() => {
    const query_token = search
      ?.replace('?', '')
      .split('&')
      .find((query) => query.indexOf('token=') !== -1)
    if (!query_token) {
      return navigate('/notfound')
    }
    const newToken = query_token.replace('token=', '')
    setToken(newToken)

    axios
      .get('/api/auth/info', {
        headers: { Authorization: `Bearer ${newToken}` },
      })
      .then(() => setLoading(false))
      .catch(() => navigate('/notfound'))
  }, [search, navigate])

  const handleChangeInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = event.currentTarget
      setPassword((state) => {
        return { ...state, [id]: value }
      })
    },
    []
  )

  const checkError = useCallback(() => {
    if (!password.new.length) {
      setError({ new: false, confirm: false })
    } else {
      const errorNew = !passwordRegex.test(password.new)
      const errorConfirm =
        Boolean(password.confirm.length) && password.new !== password.confirm
      setError({ new: errorNew, confirm: errorConfirm })
    }
  }, [password])

  const handleClickChangePassword = useCallback(async () => {
    if (Object.values(error).includes(true)) {
      return alert('Invalid password, please check password')
    }

    try {
      await axios.patch(
        '/api/auth/newpassword',
        { password: password.new },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      openAlert('Password has been changed', { severity: 'success' })
      navigate('/')
    } catch (error) {
      console.error(error)
      alert('Failed to change password')
    }
  }, [error, password.new, token, openAlert, navigate])

  useEffect(() => {
    checkQuery()
  }, [checkQuery])

  useEffect(() => {
    checkError()
  }, [checkError])

  useEffect(() => {
    setMinWidth('600px')
    return () => {
      setMinWidth()
    }
  }, [setMinWidth])

  return loading ? (
    <LoadingPage />
  ) : (
    <S.Wrapper>
      <h1 className="title">Change Password</h1>
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
            <pre>
              {`Please enter a password of 6-20 characters\nincluding English letters and numbers`}
            </pre>
          </div>
        ) : null}
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
        ) : null}
      </div>
      <S.ChangeButton onClick={handleClickChangePassword}>
        Change Password
      </S.ChangeButton>
    </S.Wrapper>
  )
}

export default ChangePassword
