import styled, { css } from 'styled-components'

const btnHoverPrimaryStyle = css`
  &:hover {
    border-color: ${({ theme }) => theme.colors.primaryColor};
  }
  &:active {
    color: ${({ theme }) => theme.colors.primaryColor};
  }
`

export const Wrapper = styled.div`
  min-height: 100%;
  width: 1000px;
  padding: 30px;
  margin: 0 auto;

  & .title {
    font-size: 30px;
    margin-bottom: 50px;
  }

  & .btn {
    padding: 4px 8px;
    border-radius: 4px;

    &.changeBtn,
    &.pw-cancelBtn,
    &.toggleBtn {
      ${btnHoverPrimaryStyle}
    }
  }
`
export const ItemBox = styled.div`
  &:not(:last-child) {
    margin-bottom: 30px;
  }

  & .item-title {
    font-size: 16px;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
  }

  & .item-divider {
    height: 1px;
    background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.16)};
    width: 90%;
    margin: 8px 0;
  }

  & .item-content {
    font-size: 14px;
  }
`

export const InputItembox = styled.div`
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

      & .btn-group {
        width: 420px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        text-align: right;

        & .pw-changeBtn {
          margin-left: 12px;
        }
      }
    `
  }}
`

export const ThemeItemContent = styled.div`
  & .theme {
    margin-right: 16px;
  }
`

export const DeleteBtn = styled.button`
  border: none;
  color: ${({ theme }) => theme.colors.secondaryColor};
  opacity: 0.75;
  transition: ease all 0.2s;
  padding: 4px 0;

  &:hover {
    opacity: 1;
  }
`
