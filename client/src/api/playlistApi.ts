import Axios from '@api/Axios'

export const getPlaylistByPermalink = (userId: string, permalink: string) => {
  return Axios.get(`/api/playlist/permalink/${userId}/${permalink}`)
}

interface PagingWithUserIdParams {
  skip: number
  take: number
  uid?: string
}

export const findPlaylistsContainsMusic = (
  musicId: number,
  params?: PagingWithUserIdParams
) => {
  return Axios.get(`/api/playlist/playlists/detail/${musicId}`, { params })
}

export const getPlaylistsByIds = (
  playlistIds: number[],
  params?: { uid?: string }
) => {
  const ids = playlistIds.join(',')
  return Axios.get(`/api/playlist/ids?ids=${ids}`, { params })
}

export const getUserPlaylists = (
  userId: string,
  params?: PagingWithUserIdParams
) => {
  return Axios.get(`/api/playlist/user/${userId}`, { params })
}

export const searchPlaylist = (
  keyward: string,
  params?: PagingWithUserIdParams
) => {
  return Axios.get(`/api/playlist/search/${keyward}`, { params })
}

export const getPlaylistsByTag = (
  tag: string,
  params?: PagingWithUserIdParams
) => {
  return Axios.get(`/api/playlist/tag/${tag}`, { params })
}

export const updatePlaylistData = (playlistId: number, body: any) => {
  return Axios.patch(`/api/playlist/update/${playlistId}`, body)
}

export const changePlaylistMusics = (
  playlistId: number,
  musicIds: number[]
) => {
  return Axios.patch(`/api/playlist/musics/change/${playlistId}`, { musicIds })
}

export const changePlaylistImage = (playlistId: number, image: File) => {
  const formData = new FormData()
  formData.append('file', image)

  return Axios.patch(`/api/playlist/image/${playlistId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const deletePlaylist = (playlistId: number) => {
  return Axios.delete(`/api/playlist/${playlistId}`)
}
