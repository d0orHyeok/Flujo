import React, { useCallback, useLayoutEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@redux/hook'
import { userAuth } from '@redux/thunks/userThunks'
import { useNavigate } from 'react-router-dom'
import Loading from '@components/Loading/Loading'

const withUser = <P extends object>(
  SpecificComponent: React.ComponentType<P>,
  option: boolean | null
) => {
  function AuthenticationCheck(props: P) {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const isLogin = useAppSelector((state) => Boolean(state.user.userData))

    const authCheck = useCallback(() => {
      if (!dispatch || !navigate) {
        return
      }
      dispatch(userAuth()).then((value) => {
        const { type } = value
        const success = type.includes('fulfilled')
        const isAuth = success ? success : isLogin

        if (isAuth) {
          if (option === false) {
            navigate('/')
          }
        } else {
          if (option) {
            navigate('/')
          }
        }

        setLoading(false)
      })
    }, [dispatch, isLogin, navigate])

    useLayoutEffect(() => {
      authCheck()
    }, [authCheck])

    return loading ? <Loading /> : <SpecificComponent {...props} />
  }
  return React.createElement(AuthenticationCheck)
}

export default withUser
