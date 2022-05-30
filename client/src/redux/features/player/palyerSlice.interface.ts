export interface IPlayerState {
  currentMusic: null | IMusic
  musics: IMusic[]
  indexing: IIndexing
  controll: IControll
  progress: IProgress
}

export interface IIndexing {
  currentIndex: number
  indexArray: number[]
}

export interface IControll {
  isPlay: boolean
  isShuffle: boolean
  repeat?: 'one' | 'all'
}

export interface IProgress {
  percent: number
  duration: number
  currentTime: number
  currentStringTime: string
  durationStringTime: string
}

export interface IProgressPayload {
  percent?: number
  duration?: number
  currentTime?: number
  currentStringTime?: string
  durationStringTime?: string
}

import { IUserData } from '../user/userSlice.interface'

export enum TypeStatus {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE',
}

export interface IMusicMetadata {
  title: string
  genre?: string
  description?: string
  artist?: string
  album: string
  albumartist?: string
  composer?: string
  year?: string
  lyrics?: string
}

export interface IMusic {
  id: number
  title: string
  permalink: string
  filename: string
  link: string
  duration: number
  count: number
  genre?: string
  description?: string
  likes: IUserData[]
  likesCount: number
  reposts: IUserData[]
  repostsCount: number
  playlists: IPlaylist[]
  playlistsCount: number
  tags?: string[]
  cover?: string
  status: TypeStatus
  metaData: IMusicMetadata
  userId: string
  user: IUserData
  comments: ICommnet[]
  commentsCount: number
  createdAt: string
  updatedAt: string
}

export interface IPlaylist {
  id: number
  name: string
  permalink: string
  image?: string
  description?: string
  tags: string[]
  status: TypeStatus
  createdAt: string
  userId: string
  user: IUserData
  musics: IMusic[]
  musicsCount: number
}

export interface ICommnet {
  id: number
  text: string
  commentedAt: number
  userId: string
  musicId: number
  user: IUserData
  music: IMusic
  createdAt: string
  updatedAt: string
}
