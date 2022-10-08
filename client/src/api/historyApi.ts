import Axios, { AxiosConfig } from './Axios'

interface CreateHistoryBody {
  userId?: string | null
  musicId: number
}

export const createHistory = async (body: CreateHistoryBody) => {
  return Axios.post('/api/history/create', body)
}

interface PagingParmsConfig extends AxiosConfig {
  params?: { skip: number; take: number }
}

export const getUsersHistorys = (config?: PagingParmsConfig) => {
  return Axios.get(`/api/history/user`, config)
}

export const clearHistory = () => {
  return Axios.patch(`/api/history/clear`)
}
