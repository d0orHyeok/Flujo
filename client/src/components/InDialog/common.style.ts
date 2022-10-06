import styled from 'styled-components'
import { Divider } from '@mui/material'

export const StyledDivider = styled(Divider)`
  border-color: ${({ theme }) => theme.colors.bgTextRGBA(0.16)} !important;
`

export const DialogContainer = styled.div`
  max-height: 80vh;
  height: auto;
  display: flex;
  flex-direction: column;
`

export const DialogTitle = styled.div`
  flex-shrink: 0;
`

export const DialogContent = styled.div`
  overflow-y: auto;
  min-height: 0;
  min-width: 0;

  &::-webkit-scrollbar {
    width: 8px;
    background-color: inherit;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 4px;
    background-color: ${({ theme }) => theme.colors.bgTextRGBA(0.3)};
  }
`

export const DialogActions = styled.div`
  flex-shrink: 0;
`
