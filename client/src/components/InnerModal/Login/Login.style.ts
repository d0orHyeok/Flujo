import styled from 'styled-components'
import * as ModalStyle from '../common.style'
import { PrimaryButton } from '@components/Common/Button'

export const Wrapper = styled(ModalStyle.InnerModalWrapper)`
  width: 420px;
  height: 400px;

  ${({ theme }) => theme.device.mobile} {
    width: 85%;
  }
`

export const Container = styled(ModalStyle.InnerModalContainer)``

export const Title = styled(ModalStyle.ModalTitle)`
  font-size: 20px;
  margin: 25px 0;
  text-align: center;
  font-weight: bold;
`

export const Content = styled(ModalStyle.ModalContent)`
  border-radius: inherit;
  padding: 25px;
  display: flex;
  flex-direction: column;
  align-items: center;

  & .signin-more {
    display: flex;
    justify-content: space-between;
    font-size: 0.8rem;

    & ul li {
      margin-right: 16px;
      position: relative;
      color: ${({ theme }) => theme.colors.bgTextRGBA('0.6')};
      display: inline-block;

      & a:hover {
        color: ${({ theme }) => theme.colors.primaryColor};
      }

      &:first-child::after {
        top: 50%;
        transform: translate(7px, -50%);
        position: absolute;
        content: '';
        width: 2px;
        height: 1em;
        background-color: ${({ theme }) => theme.colors.bgTextRGBA('0.6')};
      }
    }
  }
`

export const Box = styled.div`
  max-width: 300px;
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
