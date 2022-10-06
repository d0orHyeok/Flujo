import styled from 'styled-components'
import * as CommonStyle from '../common.style'
import { PrimaryButton } from '@components/Common/Button'

export const Wrapper = styled(CommonStyle.DialogContainer)`
  padding: 30px;
  width: 100%;
`

export const Title = styled(CommonStyle.DialogTitle)`
  font-size: 20px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
`

export const Content = styled(CommonStyle.DialogContent)`
  border-radius: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;

  & .signin-more {
    display: flex;
    justify-content: space-between;
    font-size: 13px;

    & .signin-find {
      color: ${({ theme }) => theme.colors.bgTextRGBA('0.6')};

      & button {
        border: none;
        display: inline-block;
        padding: 0;

        &:hover {
          color: ${({ theme }) => theme.colors.primaryColor};
        }
      }
    }
  }
`

export const Box = styled.div`
  padding: 0 10px;
  width: 100%;
`

export const LoginButton = styled(PrimaryButton)`
  margin: 1rem 0;
  width: 100%;
  height: 50px;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 4px;
`
