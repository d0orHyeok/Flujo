import LoadingPage from '@components/Loading/LoadingPage'
import Reload from '@components/Loading/Reload'
import { passwordRegex } from '@pages/RegisterPage/regex'
import { useAlert } from '@redux/context/alertProvider'
import { useSetMinWidth } from '@redux/context/appThemeProvider'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import * as S from './ChangePassword.style'

const Axios = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? '/'
      : 'https://wave-nestjs.herokuapp.com/',
  withCredentials: true,
})

const ChangePassword = () => {
  const { search } = useLocation()
  const navigate = useNavigate()
  const setMinWidth = useSetMinWidth()
  const openAlert = useAlert()

  const [token, setToken] = useState<string>()
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState({ new: '', confirm: '' })
  const [error, setError] = useState({ new: false, confirm: false })
  const [request, setRequest] = useState(false)

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

    Axios.get('/api/auth/info', {
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
    if (!Boolean(password.new.length) || Object.values(error).includes(true)) {
      return alert('Invalid password, please check password')
    }

    try {
      setRequest(true)
      await Axios.patch(
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
    } finally {
      setRequest(false)
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
      {!request ? (
        <S.ChangeButton onClick={handleClickChangePassword}>
          Change Password
        </S.ChangeButton>
      ) : (
        <Reload size={50} />
      )}
    </S.Wrapper>
  )
}

export default ChangePassword
