import Axios from './Axios'

export const getAllMusic = () => {
  return Axios.get('/api/music/')
}

export const getMusicByPermalink = (userId: string, permalink: string) => {
  return Axios.get(`/api/music/permalink/${userId}/${permalink}`)
}

export const findRelatedMusics = (musicId: number, skip = 0, take = 10) => {
  return Axios.get(`/api/music/related/${musicId}?skip=${skip}&take=${take}`)
}

export const getMusicsByIds = (musicIds: number[]) => {
  return Axios.get(`/api/music/ids?ids=${musicIds.join(',')}`)
}

export const getUserMusics = (userId: string, skip = 0, take = 10) => {
  return Axios.get(`/api/music/user/${userId}?skip=${skip}&take=${take}`)
}

export const getPopularMusicsOfUser = (userId: string) => {
  return Axios.get(`/api/music/popular/${userId}`)
}

export const searchMusic = (keyward: string, skip = 0, take = 10) => {
  return Axios.get(`/api/music/search/${keyward}?skip=${skip}&take=${take}`)
}

export const getMusicsByTag = (tag: string, skip = 0, take = 10) => {
  return Axios.get(`/api/music/tag/${tag}?skip=${skip}&take=${take}`)
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
