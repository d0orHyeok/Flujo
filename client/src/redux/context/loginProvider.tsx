import { createContext, useCallback, useContext, useState } from 'react'
import Login from '@components/InDialog/SignIn/Login'
import Dialog, { getTransitionSlide } from '@components/Common/Dialog'
import FindID from '@components/InDialog/SignIn/FindID'
import styled from 'styled-components'
import { MdOutlineArrowBackIosNew } from 'react-icons/md'
import FindPW from '@components/InDialog/SignIn/FindPW'

interface ILoginProviderProps {
  children: React.ReactNode
}

interface ILoginContext {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setNav: React.Dispatch<React.SetStateAction<number>>
}

const BackBtn = styled.button`
  position: absolute;
  border: none;
  top: 3px;
  font-size: 16px;
`

const LoginContext = createContext<any>({})

const Transition = getTransitionSlide('down')

export const LoginProvider = ({ children }: ILoginProviderProps) => {
  const [open, setOpen] = useState(false)
  // 0 === login, 1 === find id, 2 === find password
  const [nav, setNav] = useState(0)

  const handleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return (
    <LoginContext.Provider value={{ open, setOpen, setNav }}>
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        PaperProps={{
          style: {
            maxWidth: '420px',
            width: '100%',
          },
        }}
      >
        {!nav ? null : (
          <BackBtn title="sign in" onClick={() => setNav(0)}>
            <MdOutlineArrowBackIosNew />
          </BackBtn>
        )}
        {nav === 1 ? (
          <FindID />
        ) : nav === 2 ? (
          <FindPW />
        ) : (
          <Login open={open} onClose={handleClose} />
        )}
      </Dialog>
      {children}
    </LoginContext.Provider>
  )
}

export const useLoginOpen = () => {
  const context: ILoginContext = useContext(LoginContext)
  const { setOpen, setNav } = context

  const loginOpen = useCallback(() => {
    setNav(0)
    setOpen(true)
  }, [setOpen, setNav])

  return loginOpen
}

export type LoginNavigateParam =
  | 'login'
  | 'find_id'
  | 'find_password'
  | 0
  | 1
  | 2

export const useLoginNavigate = () => {
  const context: ILoginContext = useContext(LoginContext)
  const setNav = context.setNav

  const loginNavigate = useCallback(
    (navigate?: LoginNavigateParam) => {
      switch (navigate) {
        case 'find_id':
          setNav(1)
          break
        case 'find_password':
          setNav(2)
          break
        case 'login':
          setNav(0)
          break
        default:
          setNav(navigate || 0)
      }
    },
    [setNav]
  )

  return loginNavigate
}
