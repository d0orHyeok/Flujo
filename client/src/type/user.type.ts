import { IHistory } from './history.type'
import { IComment } from './comment.type'
import { IMusic } from './music.type'
import { IPlaylist } from './playlist.type'

export interface IUser extends IUserRelationData {
  id: string
  username: string
  email: string
  nickname?: string
  profileImage?: string
  description?: string

  createdAt: string | Date
  updatedAt: string | Date
}

export interface IUserRelationData {
  // Likes & Reposts
  likeMusics: IMusic[]
  likePlaylists: IPlaylist[]
  repostMusics: IMusic[]
  repostPlaylists: IPlaylist[]

  // Follow
  followers: IUser[]
  following: IUser[]

  // User Create Datas
  musics: IMusic[]
  playlists: IPlaylist[]
  comments: IComment[]
  historys: IHistory[]

  // Count
  likeMusicsCount: number
  likePlaylistsCount: number
  repostMusicsCount: number
  repostPlaylistsCount: number

  followersCount: number
  followingCount: number

  musicsCount: number
  playlistsCount: number
  commentsCount: number
}
