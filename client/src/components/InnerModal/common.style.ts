import styled from 'styled-components'
import { Divider } from '@mui/material'

export const StyledDivider = styled(Divider)`
  border-color: ${({ theme }) => theme.colors.bgTextRGBA(0.16)} !important;
`

export const InnerModalWrapper = styled.div`
  position: fixed;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.colors.bgColor};
  box-shadow: 3px 3px 10px 0 ${({ theme }) => theme.colors.bgTextRGBA(0.16)};

  border-radius: 6px;
  max-width: 850px;
  width: 100%;

  @media screen and (max-width: 1000px) {
    width: 85%;
  }
`

export const InnerModalContainer = styled.div`
  padding: 25px;
`
