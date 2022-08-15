import Axios from './Axios'

interface UserIdParams {
  uid?: string
}

interface PagingParams {
  skip: number
  take: number
}

interface PagingWithUserIdParams extends UserIdParams, PagingParams {}

interface GetAllMusicParams {
  option?: 'trend' | 'newrelease'
}

export const getAllMusic = (params?: GetAllMusicParams) => {
  return Axios.get('/api/music/', { params })
}

export const getMusicByPermalink = (userId: string, permalink: string) => {
  return Axios.get(`/api/music/permalink/${userId}/${permalink}`)
}

export const findRelatedMusics = (musicId: number, params?: PagingParams) => {
  return Axios.get(`/api/music/related/${musicId}`, { params })
}

export const getMusicsByIds = (musicIds: number[], params?: UserIdParams) => {
  const ids = musicIds.join(',')
  return Axios.get(`/api/music/ids?ids=${ids}`, { params })
}

export const getUserMusics = (userId: string, params?: PagingParams) => {
  return Axios.get(`/api/music/user/${userId}`, { params })
}

export const getPopularMusicsOfUser = (
  userId: string,
  params?: UserIdParams
) => {
  return Axios.get(`/api/music/popular/${userId}`, { params })
}

interface GetChartMusicsParams {
  genre?: string
  date?: number | 'week' | 'month'
}

export const getTrendingMusics = (params?: GetChartMusicsParams) => {
  return Axios.get('/api/music/trend', { params })
}

export const getNewReleaseMusics = (params?: GetChartMusicsParams) => {
  return Axios.get('/api/music/newrelease', { params })
}

export const searchMusic = (
  keyward: string,
  params?: PagingWithUserIdParams
) => {
  return Axios.get(`/api/music/search/${keyward}`, { params })
}

export const getMusicsByTag = (
  tag: string,
  params?: PagingWithUserIdParams
) => {
  return Axios.get(`/api/music/tag/${tag}`, { params })
}

export const uploadMusic = (formData: FormData) => {
  return Axios.post('/api/music/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const updateMusicData = (musicId: number, body: any) => {
  return Axios.patch(`/api/music/${musicId}/update`, body)
}

export const changeMusicCover = (musicId: number, cover: File) => {
  const formData = new FormData()
  formData.append('file', cover)

  return Axios.patch(`/api/music/${musicId}/cover`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const delelteMusic = (musicId: number) => {
  return Axios.delete(`/api/music/${musicId}`)
}
