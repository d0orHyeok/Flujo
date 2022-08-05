import { IComment } from './comment.type'
import { TypeStatus } from './common.type'
import { IPlaylist } from './playlist.type'
import { IUser } from './user.type'

export interface IMusicOptionalData {
  genre?: string[]
  description?: string
  tags?: string[]
  cover?: string
  waveform?: string
}

export interface IMusicMetadata {
  artist?: string
  album?: string
  albumartist?: string
  composer?: string[]
  year?: number
  lyrics?: string[]
}

export interface IMusicEditableData extends IMusicMetadata, IMusicOptionalData {
  title: string
  permalink: string
  status: TypeStatus
}

export interface IMusic extends IMusicEditableData {
  id: number

  // Music Data
  filename: string
  link: string
  duration: number
  count: number

  // Relation Data
  likes: IUser[]
  reposts: IUser[]
  playlists: IPlaylist[]
  // Count of Relation
  likesCount: number
  repostsCount: number
  playlistsCount: number

  // Create User
  userId: string
  user: IUser

  // Comment
  comments: IComment[]
  commentsCount: number

  // Date
  createdAt: string | Date
  updatedAt: string | Date
}
