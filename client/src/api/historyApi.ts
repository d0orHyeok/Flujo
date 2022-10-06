import Axios, { AxiosConfig } from './Axios'

interface PagingParmsConfig extends AxiosConfig {
  params?: { skip: number; take: number }
}

export const getUsersHistorys = (config?: PagingParmsConfig) => {
  return Axios.get(`/api/history/user`, config)
}

export const clearHistory = () => {
  return Axios.patch(`/api/history/clear`)
}
