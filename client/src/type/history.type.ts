import { IUser } from './user.type'
import { IMusic } from './music.type'

export interface IHistory {
  id: number
  musicId: number
  userId: string
  music: IMusic
  user: IUser
  createdAt: Date | number | string
  updatedAt: Date | number | string
}
