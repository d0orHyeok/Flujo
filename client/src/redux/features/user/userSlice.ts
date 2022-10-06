import { IPlaylist } from '@appTypes/types.type.'
import { RootState } from '@redux/store'
import { createSlice } from '@reduxjs/toolkit'
import { interceptWithAccessToken } from '@api/Axios'
import { IUserState } from './userSlice.interface'
import * as userThunks from '@redux/thunks/userThunks'
import * as playlistThunks from '@redux/thunks/playlistThunks'

const initialState: IUserState = {
  isLogin: false,
  userData: undefined,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: {
    // 로그인
    [userThunks.userLogin.fulfilled.type]: (state, action) => {
      const { accessToken, userData } = action.payload
      interceptWithAccessToken(accessToken)
      state.isLogin = true
      state.userData = userData
    },
    [userThunks.userLogin.rejected.type]: (state) => {
      state.isLogin = false
      state.userData = undefined
    },
    [userThunks.userAuth.fulfilled.type]: (state, action) => {
      state.isLogin = true

      // 재요청이 방지되거나 기존데이터와 변화가 없다면 null 값을 받는다
      const newData = action.payload
      if (Boolean(newData)) {
        state.userData = newData
      }
    },
    [userThunks.userAuth.rejected.type]: (state) => {
      state.isLogin = false
      state.userData = undefined
    },
    [userThunks.userLogout.pending.type]: (state) => {
      interceptWithAccessToken('')
      state.isLogin = false
      state.userData = undefined
    },
    [userThunks.userLogout.fulfilled.type]: (state) => {
      state.isLogin = false
      state.userData = undefined
    },
    [userThunks.userLogout.rejected.type]: (state) => {
      state.isLogin = false
      state.userData = undefined
    },
    [userThunks.userChangeEmail.fulfilled.type]: (state, action) => {
      if (state.userData) {
        state.userData.email = action.payload
      }
    },

    [userThunks.userToggleFollow.fulfilled.type]: (state, action) => {
      if (state.userData) {
        const following: any[] = action.payload.following
        state.userData.following = following
        state.userData.followingCount = following.length || 0
      }
    },
    [userThunks.userUpdateImage.fulfilled.type]: (state, action) => {
      if (state.userData) {
        const { profileImage, nickname, description } = action.payload
        state.userData.profileImage = profileImage
        state.userData.nickname = nickname
        state.userData.description = description
      }
    },
    [userThunks.userUpdateProfile.fulfilled.type]: (state, action) => {
      if (state.userData) {
        const { nickname, description } = action.payload
        state.userData.nickname = nickname
        state.userData.description = description
      }
    },
    [userThunks.userToggleLike.fulfilled.type]: (state, action) => {
      if (state.userData) {
        const { targetType, data } = action.payload
        const affectColumn =
          targetType === 'music' ? 'likeMusics' : 'likePlaylists'
        state.userData[affectColumn] = data[affectColumn]
      }
    },
    [userThunks.userToggleRepost.fulfilled.type]: (state, action) => {
      if (state.userData) {
        const { targetType, data } = action.payload
        const affectColumn =
          targetType === 'music' ? 'repostMusics' : 'repostPlaylists'
        state.userData[affectColumn] = data[affectColumn]
      }
    },
    [playlistThunks.userAddMusicsToPlaylist.fulfilled.type]: (
      state,
      action
    ) => {
      if (state.userData) {
        const updatePlaylist: IPlaylist = action.payload
        state.userData.playlists = state.userData.playlists.map((playlist) =>
          playlist.id === updatePlaylist.id
            ? {
                ...playlist,
                musics: updatePlaylist.musics,
                updatedAt: updatePlaylist.updatedAt,
              }
            : playlist
        )
      }
    },
    [playlistThunks.userDeleteMusicsFromPlaylist.fulfilled.type]: (
      state,
      action
    ) => {
      if (state.userData) {
        const updatePlaylist: IPlaylist = action.payload
        state.userData.playlists = state.userData.playlists.map((playlist) =>
          playlist.id === updatePlaylist.id
            ? {
                ...playlist,
                musics: updatePlaylist.musics,
                updatedAt: updatePlaylist.updatedAt,
              }
            : playlist
        )
      }
    },
    [playlistThunks.userCreatePlaylist.fulfilled.type]: (state, action) => {
      if (state.userData) {
        const createPlaylist: IPlaylist = action.payload
        const existPlaylists = state.userData.playlists || []
        state.userData.playlists = [...existPlaylists, createPlaylist]
      }
    },
    [userThunks.userDeleteItem.fulfilled.type]: (state, action) => {
      const { targetType, deleteId }: userThunks.IUserDeleteItemReturnValue =
        action.payload
      if (state.userData) {
        if (targetType === 'music') {
          state.userData.musics = state.userData.musics.filter(
            (m) => m.id !== deleteId
          )
        } else {
          state.userData.playlists = state.userData.playlists.filter(
            (m) => m.id !== deleteId
          )
        }
      }
    },
    [userThunks.userDeleteAccount.fulfilled.type]: (state) => {
      state.userData = undefined
      state.isLogin = false
    },
  },
})

// Action creators are generated for each case reducer function
export const {} = userSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.user
export const selectUserData = (state: RootState) => state.user.userData

export default userSlice.reducer
