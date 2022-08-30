import Axios from '@api/Axios'

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
      return response.data.accessToken
    } catch (error: any) {
      return rejectWithValue(error?.response?.status)
    }
  }
)

export const userAuth = createAsyncThunk('AUTH', async () => {
  const response = await Axios.get('/api/auth/info')
  return response.data
})

export const userLogout = createAsyncThunk('LOGOUT', async () => {
  await Axios.post('/api/auth/signout')
})

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

export const userDeleteImage = createAsyncThunk(
  'USER_DELETE_IMAGE',
  async () => {
    const response = await Axios.patch(`/api/auth/image/delete`)
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
