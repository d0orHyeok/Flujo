import { AxiosConfig } from './../../api/Axios'
import Axios from '@api/Axios'
import { delelteMusic } from '@api/musicApi'
import { deletePlaylist } from '@api/playlistApi'
import { createAsyncThunk } from '@reduxjs/toolkit'

interface IUserLoginBody {
  username: string
  password: string
}

export const userLogin = createAsyncThunk(
  'LOGIN',
  async (loginBody: IUserLoginBody, { rejectWithValue }) => {
    try {
      const response = await Axios.post('/api/auth/signin', loginBody)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error?.response?.status)
    }
  }
)

export const userAuth = createAsyncThunk(
  'AUTH',
  async (config: AxiosConfig | undefined, { getState }) => {
    const state: any = getState()
    const updatedat = state.user.userData?.updatedAt
    const response = await Axios.get('/api/auth/info', {
      ...config,
      params: { updatedat },
    })
    return response.data
  }
)

export const userLogout = createAsyncThunk('LOGOUT', async () => {
  await Axios.post('/api/auth/signout')
})

export const userChangeEmail = createAsyncThunk(
  'CHANGE_EMAIL',
  async (email: string) => {
    const response = await Axios.patch(`/api/auth/email`, { email })
    return response.data
  }
)

export const userToggleFollow = createAsyncThunk(
  'TOGGLE_FOLLOW',
  async (targetId: string) => {
    const response = await Axios.patch(`/api/auth/follow/${targetId}`)
    return response.data
  }
)

export const userUpdateImage = createAsyncThunk(
  'USER_UPDATE_IMAGE',
  async (formData: FormData) => {
    const response = await Axios.patch(`/api/auth/image/update`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return response.data
  }
)

interface IUpdateProfileBody {
  nickname?: string
  description?: string
}

export const userUpdateProfile = createAsyncThunk(
  'USER_UPDATE_PROFILE',
  async (body: IUpdateProfileBody) => {
    const response = await Axios.patch(`/api/auth/profile`, body)
    return response.data
  }
)

interface UserToggleTargetParam {
  targetType: 'music' | 'playlist'
  targetId: number
}

export const userToggleLike = createAsyncThunk(
  'TOGGLE_LIKES',
  async (param: UserToggleTargetParam) => {
    const { targetId, targetType } = param
    const response = await Axios.patch(
      `/api/auth/like/${targetType}/${targetId}`
    )
    return { targetType, data: response.data }
  }
)

export const userToggleRepost = createAsyncThunk(
  'USER_REPOST',
  async (param: UserToggleTargetParam) => {
    const { targetId, targetType } = param
    const response = await Axios.patch(
      `/api/auth/repost/${targetType}/${targetId}`
    )
    return { targetType, data: response.data }
  }
)

export interface IUserDeleteItemReturnValue {
  targetType: 'music' | 'playlist'
  deleteId: number
}

export const userDeleteItem = createAsyncThunk(
  'DELETE_ITEM',
  async (param: UserToggleTargetParam) => {
    const { targetId, targetType } = param
    const func = targetType === 'music' ? delelteMusic : deletePlaylist
    await func(targetId)
    return { targetType, deleteId: targetId }
  }
)

export const userDeleteAccount = createAsyncThunk(
  'DELETE_ACCOUNT',
  async () => {
    const response = await Axios.delete('/api/auth')
    return response.data
  }
)
