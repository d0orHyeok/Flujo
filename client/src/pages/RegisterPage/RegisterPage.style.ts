import { PrimaryButton } from '@components/Common/Button'
import styled from 'styled-components'

export const Wrapper = styled.div`
  padding: 3rem 0;
  & .register-title {
    font-size: 1.2rem;
    text-align: center;
    margin-bottom: 3rem;
  }
`

export const InputArea = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & > * {
    margin-bottom: 1rem;
  }

  & .register-input,
  & .register-button,
  & .register-term {
    width: 480px;
    ${({ theme }) => theme.device.tablet} {
      width: 320px;
    }
  }
`

export const TermBox = styled.div`
  padding: 0.5rem 0;

  & .register-term-text {
    margin: 0.5rem 0;
    background-color: ${({ theme }) => theme.colors.bgColorRGBA('0.16')};
    border: 1px solid ${({ theme }) => theme.colors.border1};
    width: 100%;
    height: 160px;
    overflow-y: auto;
  }
`

export const RegisterButton = styled(PrimaryButton)`
  height: 50px;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: bold;
  margin: 2rem 0;
`
