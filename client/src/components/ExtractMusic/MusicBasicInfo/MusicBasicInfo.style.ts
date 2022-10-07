import styled from 'styled-components'

export const EditBasicInfo = styled.div`
  padding: 20px 0;
  display: flex;

  ${({ theme }) => theme.device.tablet} {
    flex-direction: column;
  }

  & .imageBox {
    position: relative;
    flex-shrink: 0;
    width: 256px;
    height: 256px;
    margin-right: 1rem;

    & .imageBox-control {
      position: absolute;
      top: 186px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;

      & .btn {
        cursor: pointer;
        background-color: rgba(255, 255, 255, 0.66);
        color: black;
        padding: 0 6px;
        height: 28px;
        font-size: 12px;
        border-radius: 4px;
        border: 1px solid lightgray;

        & .icon {
          margin-right: 4px;
          font-size: 16px;
        }

        &.imageBtn {
          display: inline-flex;
          align-items: center;
        }

        &.resetBtn {
          margin-top: 4px;
        }
      }
    }

    & .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    ${({ theme }) => theme.device.tablet} {
      align-self: center;
      margin-right: 0;
      margin: 1rem;
    }
  }
`

export const EditBasicInfoForm = styled.form`
  min-width: 0;
  flex-grow: 1;
`

export const EditInputBox = styled.div`
  font-size: 0.9rem;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  & .label {
    display: block;
    margin-bottom: 0.5rem;

    & .require {
      display: inline;
      color: ${({ theme }) => theme.colors.errorColor};
    }
  }

  & input,
  & textarea {
    border: 1px solid ${({ theme }) => theme.colors.border1};
    border-radius: 4px;
    background-color: inherit;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
    width: 100%;
    font-size: 0.85rem;
    padding: 4px 8px;

    &:hover,
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.border2};
    }
  }
  & textarea {
    resize: vertical;
  }
`

export const EditInputPermalink = styled(EditInputBox)`
  & .inputwrap {
    width: 100%;
    display: flex;
    height: 1.5rem;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};

    & label {
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;
      white-space: nowrap;
    }

    & input {
      width: auto;
      flex-grow: 1;
      padding: 4px 0;
      border: none;
      &:focus {
        border: 1px solid ${({ theme }) => theme.colors.border2};
      }
    }

    & input:focus + .permalinkBtn {
      display: none;
    }

    & .permalinkBtn {
      border: none;
      & svg {
        width: 1rem;
        height: 1rem;
      }
      &:hover {
        color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
      }
    }
  }
`

export const EditInputPrivacy = styled(EditInputBox)`
  & input {
    width: auto;
  }
`

export const GenreInputBox = styled(EditInputBox)`
  display: flex;
  flex-wrap: wrap;
`

export const GenreBox = styled.div`
  min-width: 0;

  &:first-child {
    margin-right: 8px;
  }

  & input {
    margin-top: 8px;
    height: 30px;
    font-size: 13px;
    min-width: 220px;
  }
`

export const OptionTitle = styled.h2`
  font-size: 12px;
  padding: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border1};
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
  margin: 10px 0;
`

export const OptionBox = styled.div`
  font-size: 13px;
  padding: 0 20px;
`
