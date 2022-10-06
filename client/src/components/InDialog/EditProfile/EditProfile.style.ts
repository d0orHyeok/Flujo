import styled from 'styled-components'
import * as CommonStyle from '../common.style'

export const Container = styled(CommonStyle.DialogContainer)`
  padding: 20px;
  width: 650px;

  ${({ theme }) => theme.device.tablet} {
    width: auto;
  }
`

export const Title = styled(CommonStyle.DialogTitle)`
  font-size: 18px;
  line-height: 18px;
`

export const EditContainer = styled(CommonStyle.DialogContent)`
  padding: 10px 0;
  display: flex;

  & .area-image {
    padding: 0 16px;
    position: relative;
    & .empty,
    & .profileImage {
      width: 250px;
      height: 250px;
      border-radius: 50%;

      ${({ theme }) => theme.device.tablet} {
        width: 160px;
        height: 160px;
      }

      & img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    & .upload {
      position: absolute;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);

      & .select {
        display: none;
      }

      &:hover {
        & > * {
          background-color: white;
        }
        & .select {
          display: flex;
        }
      }
    }
  }

  & .area-text {
    width: 100%;

    & input,
    & textarea {
      &:focus {
        outline: none;
        border-color: ${({ theme }) => theme.colors.border2};
      }
      border: 1px solid ${({ theme }) => theme.colors.border1};
      background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.16)};
      border-radius: 3px;
      color: inherit;
      width: 100%;
    }

    & input {
      font-size: 14px;
      padding: 6px;
    }

    & .item {
      margin-bottom: 30px;
      &:last-child {
        margin-bottom: 0;
      }

      & .item-title {
        font-size: 14px;
        line-height: 14px;
        margin-bottom: 8px;
        & span {
          color: ${({ theme }) => theme.colors.errorColor};
        }
      }
    }
  }
`

export const UploadButton = styled.button`
  background-color: lightgray;
  color: black;
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 3px;
  transition: 0.2s ease all;
  width: 130px;
  font-size: 13px;
  &:hover {
    background-color: white;
  }
`

export const UpdateImage = styled.div`
  position: absolute;
  width: 130px;
  display: flex;
  flex-direction: column;
  background-color: white;
  color: black;
  box-shadow: 1px 1px 5px 1px rgba(0, 0, 0, 0.16);
  border: 1px solid rgba(0, 0, 0, 0.6);

  & button {
    font-size: 13px;
    transition: 0.2s ease all;
    padding: 1px;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      color: ${({ theme }) => theme.colors.primaryColor};
    }
  }
`

export const ButtonArea = styled(CommonStyle.DialogContent)`
  display: flex;
  justify-content: right;

  & button {
    height: 30px;
    padding: 0 8px;
    border-radius: 3px;

    &:last-child {
      margin-left: 8px;
    }
  }

  & button.block {
    filter: grayscale(100%);
    cursor: default;
  }
`
