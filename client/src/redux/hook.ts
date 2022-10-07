import { useLoginOpen } from '@redux/context/loginProvider'
import { AnyAction, ThunkAction } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import { IPlayerState } from './features/player/palyerSlice.interface'
import { IUserState } from './features/user/userSlice.interface'
import type { RootState, AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAuthDispatch = () => {
  const appdispatcher = useAppDispatch()
  const signin = useLoginOpen()
  const waveAuth = Boolean(useAppSelector((state) => state.user.userData?.id))

  return <T>(
    thunkAction: ThunkAction<
      T,
      {
        user: IUserState
        player: IPlayerState
      },
      undefined,
      AnyAction
    >
  ): T => {
    if (!waveAuth) {
      signin()
    }
    return appdispatcher(thunkAction)
  }
}
