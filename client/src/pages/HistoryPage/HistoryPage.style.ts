import { Divider } from '@mui/material'
import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  min-width: 650px;
  padding: 0 32px;
  min-height: 100%;
`

export const Container = styled.div`
  & .title {
    padding: 20px 0;
    font-size: 18px;
  }

  & .filterBox {
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
