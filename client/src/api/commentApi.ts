import Axios, { AxiosConfig } from '@api/Axios'

interface CreateCommentBody {
  text: string
  musicId: number
  commentedAt?: number
}

export const getCommentsByUserId = (userId: string, config?: AxiosConfig) => {
  return Axios.get(`/api/comment/user/${userId}`, config)
}

export const createComment = (
  createCommentBody: CreateCommentBody,
  config?: AxiosConfig
) => {
  const parseIntValue = Math.floor(createCommentBody.commentedAt || 0)
  return Axios.post(
    '/api/comment/create',
    { ...createCommentBody, commentedAt: parseIntValue },
    config
  )
}

export const deleteComment = (commentId: number) => {
  return Axios.delete(`/api/comment/${commentId}`)
}
