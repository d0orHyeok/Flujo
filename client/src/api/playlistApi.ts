import Axios, { AxiosConfig } from '@api/Axios'

export const getPlaylistByPermalink = (
  userId: string,
  permalink: string,
  config?: AxiosConfig
) => {
  return Axios.get(`/api/playlist/permalink/${userId}/${permalink}`, config)
}

interface PagingWithUserIdParamsConfig extends AxiosConfig {
  params?: { skip: number; take: number; uid?: string }
}

export const findPlaylistsContainsMusic = (
  musicId: number,
  config?: PagingWithUserIdParamsConfig
) => {
  return Axios.get(`/api/playlist/playlists/detail/${musicId}`, config)
}

interface UserIdParamsConfig extends AxiosConfig {
  params?: { uid?: string }
}

export const getPlaylistsByIds = (
  playlistIds: number[],
  config?: UserIdParamsConfig
) => {
  const ids = playlistIds.join(',')
  return Axios.get(`/api/playlist/ids?ids=${ids}`, config)
}

export const getUserPlaylists = (
  userId: string,
  config?: PagingWithUserIdParamsConfig
) => {
  return Axios.get(`/api/playlist/user/${userId}`, config)
}

export const searchPlaylist = (
  keyward: string,
  config?: PagingWithUserIdParamsConfig
) => {
  return Axios.get(`/api/playlist/search/${keyward}`, config)
}

export const getPlaylistsByTag = (
  tag: string,
  config?: PagingWithUserIdParamsConfig
) => {
  return Axios.get(`/api/playlist/tag/${tag}`, config)
}

export const updatePlaylistData = (
  playlistId: number,
  body: any,
  config?: AxiosConfig
) => {
  return Axios.patch(`/api/playlist/update/${playlistId}`, body, config)
}

export const changePlaylistImage = (
  playlistId: number,
  image: File,
  body?: any
) => {
  const formData = new FormData()
  formData.append('file', image)
  if (body) {
    formData.append(
      'data',
      new Blob([JSON.stringify(body)], { type: 'application/json' })
    )
  }

  return Axios.patch(`/api/playlist/image/${playlistId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const deletePlaylist = (playlistId: number) => {
  return Axios.delete(`/api/playlist/${playlistId}`)
}
