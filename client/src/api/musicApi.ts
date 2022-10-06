import Axios, { AxiosConfig } from './Axios'

interface UserIdParamsConfig extends AxiosConfig {
  params?: { uid?: string }
}

interface PagingParamsConfig extends AxiosConfig {
  params?: { skip: number; take: number }
}

interface PagingWithUserIdParamsConfig extends AxiosConfig {
  params?: { skip: number; take: number; uid?: string }
}

interface GetAllMusicParamsConfig extends AxiosConfig {
  params?: { option?: 'trend' | 'newrelease' }
}

export const getAllMusic = (config?: GetAllMusicParamsConfig) => {
  return Axios.get('/api/music/', config)
}

export const getMusicByPermalink = (
  userId: string,
  permalink: string,
  config?: AxiosConfig
) => {
  return Axios.get(`/api/music/permalink/${userId}/${permalink}`, config)
}

export const findRelatedMusics = (
  musicId: number,
  config?: PagingParamsConfig
) => {
  return Axios.get(`/api/music/related/${musicId}`, config)
}

export const getMusicsByIds = (
  musicIds: number[],
  config?: UserIdParamsConfig
) => {
  const ids = musicIds.join(',')
  return Axios.get(`/api/music/ids?ids=${ids}`, config)
}

export const getUserMusics = (
  userId: string,
  config?: PagingWithUserIdParamsConfig
) => {
  return Axios.get(`/api/music/user/${userId}`, config)
}

export const getPopularMusicsOfUser = (
  userId: string,
  config?: UserIdParamsConfig
) => {
  return Axios.get(`/api/music/popular/${userId}`, config)
}

interface GetChartedMusicsParamsConfig extends AxiosConfig {
  params?: {
    chart: 'trend' | 'newrelease'
    genre?: string | string[]
    date?: number | 'week' | 'month' | string
  }
}

export const getChartedMusics = (config?: GetChartedMusicsParamsConfig) => {
  return Axios.get('/api/music/chart', config)
}

export const searchMusic = (
  keyward: string,
  config?: PagingWithUserIdParamsConfig
) => {
  return Axios.get(`/api/music/search/${keyward}`, config)
}

export const getMusicsByTag = (
  tag: string,
  config?: PagingWithUserIdParamsConfig
) => {
  return Axios.get(`/api/music/tag/${tag}`, config)
}

export const uploadMusic = (formData: FormData, config?: AxiosConfig) => {
  return Axios.post('/api/music/upload', formData, {
    ...config,
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const updateMusicData = (
  musicId: number,
  body: any,
  config?: AxiosConfig
) => {
  return Axios.patch(`/api/music/${musicId}/update`, body, config)
}

export const changeMusicCover = (musicId: number, cover: File, data?: any) => {
  const formData = new FormData()
  formData.append('cover', cover)
  if (data) {
    formData.append(
      'data',
      new Blob([JSON.stringify(data)], { type: 'application/json' })
    )
  }

  return Axios.patch(`/api/music/${musicId}/cover`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const delelteMusic = (musicId: number) => {
  return Axios.delete(`/api/music/${musicId}`)
}
