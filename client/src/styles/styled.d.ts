// import original module declarations
import 'styled-components'

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme {
    colors: Colors
    device: Device
    minWidth?: string | number
  }
}

interface Colors {
  primaryColor: string
  primaryVariantColor: string
  secondaryColor: string
  bgColor: string
  bgColorRGB: string
  bgColorRGBA: (opacity: string | number) => string
  errorColor: string
  primaryText: string
  secondaryText: string
  bgText: string
  bgTextRGBA: (opacity: string | number) => string
  errorText: string
  border1: string
  border2: string
}

interface Device {
  mobile: string
  tablet: string
  desktop: string
}
