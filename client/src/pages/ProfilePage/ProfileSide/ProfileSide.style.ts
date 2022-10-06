import { Divider } from '@mui/material'
import styled from 'styled-components'

export const Container = styled.div`
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
  font-size: 14px;
  line-height: 14px;
`

export const StyledDivider = styled(Divider)`
  background-color: ${({ theme }) => theme.colors.border1};
`

export const NumBox = styled.div`
  display: flex;
  align-items: center;
`

export const NumBoxItem = styled.div`
  flex-grow: 1;
  cursor: pointer;
  padding: 6px 12px;

  &:not(:last-child) {
    border-right: 1px solid ${({ theme }) => theme.colors.border1};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
  }

  & .tag {
    font-size: 12px;
    margin-bottom: 8px;
  }

  & .num {
    font-size: 18px;
  }
`

export const DescBox = styled.div`
  padding: 10px;
  color: ${({ theme }) => theme.colors.bgTextRGBA(0.95)};
  white-space: normal;
`

export const BoxTitle = styled.h2`
  padding: 10px 0;
  display: flex;
  align-items: center;

  & .icon {
    margin-right: 5px;
    &.repost,
    &.soundwave {
      font-size: 16px;
    }
  }

  & .text {
    margin-right: auto;
  }

  & .view {
    &:hover {
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
    }
  }
`

export const ItemBox = styled.div`
  padding: 10px 0;
`

export const Item = styled.div`
  display: flex;

  &:not(:last-child) {
    margin-bottom: 10px;
  }

  & .imgBox {
    margin-right: 10px;
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    & .link,
    & .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  & .info {
    min-width: 0;
    & .user,
    & .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    & .user {
      position: relative;
      margin-bottom: 5px;
    }

    & .name,
    & .user a:hover {
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
    }
  }
`

export const ItemFollowing = styled(Item)`
  & .imgBox .img {
    border-radius: 25px;
  }
  & .info {
    flex-grow: 1;
    margin: auto 0;

    & .num {
      display: flex;
      align-items: center;

      & .num-item {
        &:not(:last-child) {
          margin-right: 8px;
        }

        & .icon {
          margin-right: 4px;
          font-size: 13px;
        }

        &:hover {
          color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
        }
      }

      & .num-button {
        margin-left: auto;
        background-color: inherit;
        border-radius: 4px;

        &:hover {
          border-color: ${({ theme }) => theme.colors.border2};
        }
      }
    }
  }
`

export const UserBox = styled(ItemBox)`
  display: flex;
`

export const UserItem = styled.div`
  position: relative;

  &:not(:last-child) {
    margin-right: -10px;
  }

  & .imgBox {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    border: 2px solid ${({ theme }) => theme.colors.bgColor};
    & .link,
    & .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
  }
`

export const CommentItem = styled.div`
  font-size: 13px;
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border1};

    &:hover {
      border-color: ${({ theme }) => theme.colors.border2};
    }
  }

  & .head {
    display: flex;
    align-items: center;
    margin-bottom: 6px;

    & .music-title {
      &:before {
        content: 'on';
        margin-right: 8px;
        color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
      }

      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: ${({ theme }) => theme.colors.bgTextRGBA(0.6)};
      &:hover {
        color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
      }
    }

    & .createdAt {
      margin-left: auto;
      flex-shrink: 0;
      font-size: 12px;
    }
  }

  & .text {
    color: ${({ theme }) => theme.colors.bgTextRGBA(0.86)};
  }
`
