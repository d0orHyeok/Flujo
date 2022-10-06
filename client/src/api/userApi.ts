import Axios, { AxiosConfig } from './Axios'

interface IUserRegisterBody {
  username: string
  password: string
  email: string
  nickanem?: string
}

export const userSignUp = (
  registerInfo: IUserRegisterBody,
  config?: AxiosConfig
) => {
  return Axios.post('/api/auth/signup', registerInfo, config)
}

export const getUserById = (userId: string, config?: AxiosConfig) => {
  return Axios.get(`/api/auth/${userId}`, config)
}

interface PagingParamsConfig extends AxiosConfig {
  params?: { skip: number; take: number }
}

export const searchUser = (keyward: string, config?: PagingParamsConfig) => {
  return Axios.get(`/api/auth/search/${keyward}`, config)
}

interface ChnagePasswordBody {
  password: string
  newPassword: string
}

export const changePassword = (
  body: ChnagePasswordBody,
  config?: AxiosConfig
) => {
  return Axios.patch('/api/auth/password', body, config)
}

export const findSigninInfo = (
  body: { email: string } | { username: string }
) => {
  return Axios.post('/api/auth/find', body)
}
