import * as CommonStyle from './../common.style'
import styled from 'styled-components'
import Button, { PrimaryButton } from '@components/Common/Button'

export const Container = styled(CommonStyle.DialogContainer)`
  font-size: 14px;
  padding: 20px 0;
`

export const Title = styled(CommonStyle.DialogTitle)`
  font-size: 16px;
  padding: 0 20px;
`

export const DialogContent = styled(CommonStyle.DialogContent)`
  padding: 0 20px;
`

export const TitleUllist = styled.ul`
  display: flex;
`

export const TitleItem = styled.li<{ select?: boolean }>`
  position: relative;
  margin-right: 1rem;
  cursor: pointer;
  color: ${({ theme, select }) =>
    select ? theme.colors.primaryColor : 'inherit'};
  padding-bottom: 0.75rem;

  &:last-child {
    margin-right: 0;
  }

  &::after {
    display: ${({ select }) => (select ? 'block' : 'none')};
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ theme, select }) =>
      select ? theme.colors.primaryColor : theme.colors.bgText};
  }
  &:hover::after {
    display: block;
  }
`

export const TextInput = styled.input`
  background-color: ${({ theme }) => theme.colors.bgColorRGBA(0.16)};
  border: 1px solid ${({ theme }) => theme.colors.border1};
  color: ${({ theme }) => theme.colors.bgText};
  padding: 4px;
  border-radius: 3px;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.border2};
  }
`

export const Content = styled.div`
  padding: 20px 0;
  min-height: 0;
`

// AddPlaylist
export const AddContent = styled(Content)`
  padding-bottom: 0;

  & .ul-playlists {
    margin-top: 20px;
  }
`

export const PlaylistItem = styled.li`
  display: flex;
  align-items: center;
  padding: 10px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border1};
  }

  & .image {
    flex-shrink: 0;
    height: 50px;
    width: 50px;
    margin-right: 12px;

    & .link,
    & .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  & .info {
    min-width: 0;
    font-size: 12px;

    & .info-name,
    & .info-num {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      cursor: default;
    }

    & .info-num {
      min-width: 0;
      & svg {
        transform: translateY(2px);
      }
    }
  }
`

export const AddButton = styled(Button)<{ added: boolean }>`
  margin-left: auto;
  flex-shrink: 0;
  padding: 4px;
  border-radius: 4px;
  ${({ added, theme }) =>
    added &&
    `
    &,
    &:hover {
      border-color: ${theme.colors.primaryColor};
      color: ${theme.colors.primaryColor};
    }`};
`

// CreatePlaylist
export const CreatePlaylist = styled(Content)`
  & .inputBox {
    margin-bottom: 1rem;
  }

  & .inputBox.flex {
    display: flex;
    align-items: flex-start;
  }
`

export const Label = styled.h2`
  margin-bottom: 0.5rem;
  & span {
    color: ${({ theme }) => theme.colors.errorColor};
  }
`

export const SaveBox = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
`

export const SaveButton = styled(PrimaryButton)`
  padding: 2px 6px;
  border-radius: 3px;
`

export const AddMusicsWrapper = styled.ul`
  border: 1px solid ${({ theme }) => theme.colors.border1};
`

export const AddItem = styled.li`
  height: 30px;
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border1};

  &:last-child {
    border-bottom: none;
  }

  & .music-cover {
    flex-shrink: 0;
    margin-right: 8px;
    width: 30px;
    height: 28px;
    & .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  & .music-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    & span {
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
    }
  }

  & .music-close {
    flex-shrink: 0;
    margin-left: auto;
    width: 30px;
    border: none;
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
    &:hover {
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
    }
    & svg {
      transform: translateY(1px);
    }
  }
`
