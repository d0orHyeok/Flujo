import Axios from './Axios'

interface PagingParms {
  skip: number
  take: number
}

export const getUsersHistorys = (params?: PagingParms) => {
  return Axios.get(`/api/history/user`, { params })
}

export const clearHistory = () => {
  return Axios.patch(`/api/history/clear`)
}
