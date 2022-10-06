import { IUser } from '@appTypes/user.type'

export interface IUserState {
  isLogin: boolean
  userData?: IUser
}
