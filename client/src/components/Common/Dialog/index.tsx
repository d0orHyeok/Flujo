import { Dialog as MuiDialog, DialogProps, Slide } from '@mui/material'
import { TransitionProps } from '@mui/material/transitions'
import React, { useCallback } from 'react'
import { MdClose } from 'react-icons/md'
import styled, { css } from 'styled-components'

const StyledDialog = styled(MuiDialog)`
  ${({ theme }) => css`
    & .MuiBackdrop-root {
      background-color: rgba(${theme.colors.bgColorRGB}, 0.6);
    }

    & .MuiPaper-root {
      position: relative;
      background-color: ${theme.colors.bgColor};
      color: ${theme.colors.bgText};
      box-shadow: 1px 1px 3px 2px ${theme.colors.bgTextRGBA(0.16)};
      max-width: 850px;
    }
  `}
`

const CloseButton = styled.button`
  position: absolute;
  top: 3px;
  right: 5px;
  font-size: 20px;
  padding: 0;
  border: none;
`

const Dialog = ({ children, ...props }: DialogProps) => {
  const { onClose } = props

  const handleClose = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (onClose) onClose(event, 'backdropClick')
    },
    [onClose]
  )

  return (
    <StyledDialog {...props}>
      <>
        <CloseButton title="Close" onClick={handleClose}>
          <MdClose />
        </CloseButton>
        {children}
      </>
    </StyledDialog>
  )
}

export default Dialog

export const getTransitionSlide = (
  direction: 'down' | 'left' | 'right' | 'up'
) => {
  return React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>
    },
    ref: React.Ref<unknown>
  ) {
    return <Slide direction={direction} ref={ref} {...props} />
  })
}
