import { Divider } from '@mui/material'
import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 32px;
  min-height: 100%;
`

export const Container = styled.div`
  & .title {
    padding: 20px 0;
    font-size: 18px;
  }

  & .filterBox {
    position: relative;
    margin: 20px 0;

    ${({ theme }) => css`
      & .filterBox-clearBtn {
        padding: 2px 6px;
        border-radius: 4px;
        margin-right: 10px;
      }

      & .filterBox-textfield {
        padding: 0 8px;
        height: 30px;
        border-radius: 4px;
        background-color: ${theme.colors.bgColor};
        border: 1px solid ${theme.colors.border1};
        color: ${theme.colors.bgTextRGBA(0.6)};

        &:focus {
          outline: none;
          border-color: ${theme.colors.border2};
          color: ${theme.colors.bgTextRGBA(0.86)};
        }
      }
    `}
  }
`

export const StyledDivider = styled(Divider)`
  background-color: ${({ theme }) => theme.colors.border1};
`

export const MessageBox = styled.div`
  top: 100%;
  left: 10px;
  transform: translateY(6px);
  position: absolute;
  width: 220px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid ${({ theme }) => theme.colors.border1};
  box-shadow: 0 2px 5px -1px ${({ theme }) => theme.colors.bgTextRGBA(0.33)};
  background-color: ${({ theme }) => theme.colors.bgColor};
  z-index: 3;

  &::before {
    background-color: ${({ theme }) => theme.colors.bgColor};
    border: 1px solid ${({ theme }) => theme.colors.border1};
    border-bottom: none;
    border-right: none;
    border-radius: 2px;
    position: absolute;
    content: '';
    width: 12px;
    height: 12px;
    top: 0;
    left: 40px;
    transform: rotate(45deg) translateY(-8px);
  }

  & .message {
    font-size: 13px;
    word-break: normal;
    margin-bottom: 10px;
  }

  & .buttonGroup {
    text-align: center;

    & .messageBox-cancelBtn,
    & .messageBox-clearBtn {
      padding: 2px 4px;
      border-radius: 4px;
    }

    & .messageBox-cancelBtn {
      margin-right: 4px;
      border: none;
    }
  }
`

export const NoHistory = styled.div`
  padding: 10vh 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};

  & .icon {
    font-size: 160px;
  }

  & .text {
    margin-top: 30px;
    font-size: 18px;
  }
`
