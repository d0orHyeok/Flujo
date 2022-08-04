import Alert from '@components/Common/Alert'
import { createContext, useContext, useState } from 'react'
import { AlertColor } from '@mui/material/Alert'
import { SnackbarOrigin } from '@mui/material'

interface IAlertProviderProps {
  children: React.ReactNode
}

interface IAlertOpion {
  severity: AlertColor
  anchorOrigin: SnackbarOrigin
  alertText: string
  open: boolean
}

interface IAlertContext {
  alertOption: IAlertOpion
  setAlertOption: React.Dispatch<React.SetStateAction<IAlertOpion>>
}

interface IOpenAlertProps {
  severity: AlertColor
  anchorOrigin?: SnackbarOrigin
}

const AlertContext = createContext<any>({})

export const AlertProvider = ({ children }: IAlertProviderProps) => {
  const [alertOption, setAlertOption] = useState<IAlertOpion>({
    severity: 'success',
    anchorOrigin: { horizontal: 'right', vertical: 'top' },
    alertText: 'alert',
    open: false,
  })

  function onClose() {
    setAlertOption({ ...alertOption, open: false })
  }

  return (
    <AlertContext.Provider value={{ alertOption, setAlertOption }}>
      {children}
      <Alert
        sx={{ zIndex: '99999' }}
        autoHideDuration={2000}
        {...alertOption}
        onClose={onClose}
      />
    </AlertContext.Provider>
  )
}

export const useAlert = () => {
  const context = useContext(AlertContext)
  const { alertOption, setAlertOption }: IAlertContext = context

  function openAlert(message: string, option: IOpenAlertProps) {
    setAlertOption({
      ...alertOption,
      open: true,
      alertText: message,
      severity: option?.severity || alertOption.severity,
      anchorOrigin: option?.anchorOrigin || alertOption.anchorOrigin,
    })
  }

  return openAlert
}
