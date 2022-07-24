import Axios from '@api/Axios'

interface CreateHistoryBody {
  userId?: string | null
  musicId: number
}

export const createHistory = async (body: CreateHistoryBody) => {
  return Axios.post('/api/history/create', body)
}
