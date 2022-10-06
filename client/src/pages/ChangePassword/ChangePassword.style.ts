import { PrimaryButton } from '@components/Common/Button'
import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  min-height: 100%;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & .title {
    font-size: 20px;
    text-align: center;
    margin-bottom: 50px;
  }

  ${({ theme }) => {
    const c = theme.colors
    return css`
      & input {
        background-color: ${c.bgColor};
        outline: none;
        border: 1px solid ${c.border1};
        border-radius: 4px;
        font-size: 14px;
        padding: 4px;
        color: ${c.bgTextRGBA(0.6)};

        &:focus {
          border-color: ${c.border2};
          color: ${c.bgText};
        }
      }

      & .inputbox {
        position: relative;
        margin-bottom: 8px;
        width: 420px;

        & .flexbox {
          display: flex;
          align-items: center;

          & label {
            width: 180px;
          }

          & input {
            flex-grow: 1;
          }
        }

        & .error {
          text-align: center;
          display: inline-block;
          position: relative;
          font-size: 12px;
          left: 300px;
          transform: translateX(-50%);
          color: ${c.errorColor};
        }
      }
    `
  }}
`

export const ChangeButton = styled(PrimaryButton)`
  padding: 0 20px;
  height: 50px;
  border-radius: 4px;
  margin-top: 50px;
`
